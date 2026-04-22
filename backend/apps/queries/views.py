import uuid
import json
from collections import defaultdict

from django.db import transaction
from django.utils import timezone
from rest_framework import status
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from db_design.constants import QueryStatus
from apps.analytics.models import AIUsageLog
from apps.queries.models import Feedback, Query, Response as QueryResponseModel
from apps.queries.services import AILayerError, ai_layer_service
from apps.files.services import build_upload_metadata, detect_file_type, extract_editable_content


SYSTEM_EVENT_CONVERSATION_CREATED = "conversation_created"


def _short_text(value, limit=80, fallback="New Conversation"):
	text = " ".join(str(value or "").split())
	if not text:
		return fallback
	if len(text) <= limit:
		return text
	return f"{text[: max(limit - 3, 1)].rstrip()}..."


def _parse_messages(raw_messages):
	if isinstance(raw_messages, list):
		return raw_messages
	if isinstance(raw_messages, str) and raw_messages.strip():
		try:
			parsed = json.loads(raw_messages)
			return parsed if isinstance(parsed, list) else []
		except json.JSONDecodeError:
			return []
	return []


def _extract_uploaded_docs(request):
	if not hasattr(request, "FILES"):
		return [], ""

	uploaded_files = request.FILES.getlist("files")
	metadata_list = []
	text_chunks = []

	for uploaded in uploaded_files:
		try:
			file_type = detect_file_type(uploaded.name)
		except Exception:
			file_type = "unknown"

		metadata = build_upload_metadata(uploaded)
		metadata["file_type"] = file_type
		metadata_list.append(metadata)

		if file_type in {"txt", "docx"}:
			try:
				content = extract_editable_content(uploaded, file_type)
			except Exception:
				content = ""
			if content:
				text_chunks.append(f"[{uploaded.name}]\n{content[:8000]}")

	document_context = "\n\n".join(text_chunks)[:20000]
	return metadata_list, document_context


def _safe_positive_int(value, default=0):
	try:
		return max(0, int(value or default))
	except (TypeError, ValueError):
		return default


def _estimated_tokens(text):
	if not text:
		return 0
	return max(1, round(len(str(text).split()) * 1.3))


def _extract_token_usage(ai_result, content, context_text, answer):
	usage = ai_result.get("token_usage") or ai_result.get("usage") or {}
	if not isinstance(usage, dict):
		usage = {}

	input_tokens = _safe_positive_int(
		usage.get("input_tokens")
		or usage.get("prompt_tokens")
		or usage.get("inputTokens")
		or usage.get("promptTokens")
	)
	output_tokens = _safe_positive_int(
		usage.get("output_tokens")
		or usage.get("completion_tokens")
		or usage.get("outputTokens")
		or usage.get("completionTokens")
	)

	if input_tokens == 0:
		input_tokens = _estimated_tokens(f"{content}\n{context_text or ''}")
	if output_tokens == 0:
		output_tokens = _estimated_tokens(answer)

	return {
		"input_tokens": input_tokens,
		"output_tokens": output_tokens,
		"raw_usage": usage,
	}


def _build_history_payload(user):
	queries = Query.objects.filter(user=user).order_by("created_at")
	latest_by_conversation = defaultdict(dict)

	for query in queries:
		query_context = query.context or {}
		conversation_id = str(query_context.get("conversation_id") or query.id)
		title = query_context.get("title") or _short_text(query.prompt)
		row = latest_by_conversation.get(conversation_id)
		if not row or query.created_at >= row["updated_at"]:
			latest_by_conversation[conversation_id] = {
				"id": conversation_id,
				"title": title,
				"preview": _short_text(query.prompt, 96, ""),
				"updated_at": query.created_at,
				"message_count": 0,
			}

		if query_context.get("system_event") == SYSTEM_EVENT_CONVERSATION_CREATED:
			continue

		latest_by_conversation[conversation_id]["message_count"] += 2 if hasattr(query, "response") else 1

	history = sorted(latest_by_conversation.values(), key=lambda item: item["updated_at"], reverse=True)

	for item in history:
		item["updated_at"] = item["updated_at"].isoformat()

	return history


class AIChatView(APIView):
	permission_classes = [IsAuthenticated]
	parser_classes = [JSONParser, MultiPartParser, FormParser]

	def post(self, request):
		content = (request.data.get("content") or "").strip()
		conversation_id = request.data.get("conversation_id")
		raw_files = request.data.get("files") or []
		if isinstance(raw_files, str):
			files = [raw_files]
		elif isinstance(raw_files, list):
			files = raw_files
		else:
			files = []

		uploaded_file_metadata, uploaded_document_context = _extract_uploaded_docs(request)
		files.extend([item.get("original_name") for item in uploaded_file_metadata if item.get("original_name")])

		# Backward compatibility with the existing frontend payload.
		if not content:
			messages = _parse_messages(request.data.get("messages"))
			if messages:
				for message in reversed(messages):
					if message.get("role") == "user" and message.get("content"):
						content = str(message.get("content")).strip()
						break

		if not content:
			return Response({"detail": "Message content is required."}, status=status.HTTP_400_BAD_REQUEST)

		conversation_id = str(conversation_id or uuid.uuid4())
		conversation_title = _short_text(request.data.get("title") or content, 48)
		entry_point = _short_text(request.data.get("entry_point"), 80, "")
		context_text = f"Conversation ID: {conversation_id}"
		if files:
			context_text += f"\nAttached files: {', '.join([str(name) for name in files if name])}"
		if uploaded_document_context:
			context_text += f"\n\nDocument context:\n{uploaded_document_context}"

		started_at = timezone.now()
		try:
			ai_result = ai_layer_service.ask(question=content, context=context_text)
		except AILayerError as exc:
			return Response({"detail": str(exc)}, status=status.HTTP_502_BAD_GATEWAY)
		latency_ms = _safe_positive_int((timezone.now() - started_at).total_seconds() * 1000)

		answer = str(ai_result.get("answer") or "").strip() or "I could not generate a response."
		confidence = ai_result.get("confidence")
		source_documents = ai_result.get("source_documents") or []
		model_name = str(ai_result.get("model_name") or ai_result.get("model") or "ai-layer-rag")[:100]
		token_usage = _extract_token_usage(ai_result, content, context_text, answer)

		with transaction.atomic():
			# Ensure an existing conversation placeholder adopts the latest title.
			Query.objects.filter(
				user=request.user,
				context__conversation_id=conversation_id,
				context__system_event=SYSTEM_EVENT_CONVERSATION_CREATED,
			).update(updated_by=request.user, context={
				"conversation_id": conversation_id,
				"title": conversation_title,
			})

			query = Query.objects.create(
				user=request.user,
				created_by=request.user,
				updated_by=request.user,
				prompt=content,
				status=QueryStatus.ANSWERED,
				context={
					"conversation_id": conversation_id,
					"title": conversation_title,
					"entry_point": entry_point,
					"files": files,
					"uploaded_files": uploaded_file_metadata,
					"source_documents": source_documents,
				},
			)
			QueryResponseModel.objects.create(
				query=query,
				responder=request.user,
				created_by=request.user,
				updated_by=request.user,
				response_text=answer,
				latency_ms=latency_ms,
				model_name=model_name,
				token_usage={
					"confidence": confidence,
					"input_tokens": token_usage["input_tokens"],
					"output_tokens": token_usage["output_tokens"],
					"raw_usage": token_usage["raw_usage"],
				},
			)
			AIUsageLog.objects.create(
				user=request.user,
				created_by=request.user,
				updated_by=request.user,
				feature_name="AI Chat",
				model_name=model_name,
				input_tokens=token_usage["input_tokens"],
				output_tokens=token_usage["output_tokens"],
				latency_ms=latency_ms,
				metadata={
					"query_id": str(query.id),
					"conversation_id": conversation_id,
					"confidence": confidence,
					"entry_point": entry_point,
					"files": files,
					"source_documents": source_documents,
				},
			)

		return Response(
			{
				"id": str(query.id),
				"query_id": str(query.id),
				"role": "assistant",
				"content": answer,
				"timestamp": query.created_at.isoformat(),
				"conversation_id": conversation_id,
				"title": conversation_title,
				"source_documents": source_documents,
				"confidence": confidence,
			},
			status=status.HTTP_200_OK,
		)


class AIChatHistoryView(APIView):
	permission_classes = [IsAuthenticated]
	parser_classes = [JSONParser, MultiPartParser, FormParser]

	def get(self, request):
		return Response(_build_history_payload(request.user), status=status.HTTP_200_OK)

	def post(self, request):
		title = (request.data.get("title") or "New Conversation").strip()[:80] or "New Conversation"
		conversation_id = str(uuid.uuid4())

		Query.objects.create(
			user=request.user,
			created_by=request.user,
			updated_by=request.user,
			prompt="Conversation created",
			status=QueryStatus.OPEN,
			context={
				"conversation_id": conversation_id,
				"title": title,
				"system_event": SYSTEM_EVENT_CONVERSATION_CREATED,
			},
		)

		return Response(
			{
				"id": conversation_id,
				"title": title,
			},
			status=status.HTTP_201_CREATED,
		)


class AIConversationDetailView(APIView):
	permission_classes = [IsAuthenticated]

	def get(self, request, conversation_id: str):
		queries = Query.objects.filter(
			user=request.user,
			context__conversation_id=conversation_id,
		).order_by("created_at")

		if not queries.exists():
			return Response({"detail": "Conversation not found."}, status=status.HTTP_404_NOT_FOUND)

		messages = []
		title = "New Conversation"

		for query in queries:
			query_context = query.context or {}
			title = query_context.get("title") or title

			if query_context.get("system_event") == SYSTEM_EVENT_CONVERSATION_CREATED:
				continue

			messages.append(
				{
					"id": f"{query.id}-user",
					"role": "user",
					"content": query.prompt,
					"timestamp": query.created_at.isoformat(),
				}
			)
			if hasattr(query, "response"):
				messages.append(
					{
						"id": f"{query.response.id}-assistant",
						"query_id": str(query.id),
						"role": "assistant",
						"content": query.response.response_text,
						"timestamp": query.response.created_at.isoformat(),
						"source_documents": query_context.get("source_documents") or [],
						"feedback": _get_feedback_for_query(query),
					}
				)

		return Response(
			{
				"id": conversation_id,
				"title": title,
				"messages": messages,
			},
			status=status.HTTP_200_OK,
		)

	def patch(self, request, conversation_id: str):
		new_title = (request.data.get("title") or "").strip()[:80]
		if not new_title:
			return Response({"detail": "Title is required."}, status=status.HTTP_400_BAD_REQUEST)

		queries = Query.objects.filter(
			user=request.user,
			context__conversation_id=conversation_id,
		)

		if not queries.exists():
			return Response({"detail": "Conversation not found."}, status=status.HTTP_404_NOT_FOUND)

		for query in queries:
			next_context = dict(query.context or {})
			next_context["title"] = new_title
			query.context = next_context
			query.updated_by = request.user
			query.save(update_fields=["context", "updated_by", "updated_at"])

		return Response({"id": conversation_id, "title": new_title}, status=status.HTTP_200_OK)

	def delete(self, request, conversation_id: str):
		queries = Query.objects.filter(
			user=request.user,
			context__conversation_id=conversation_id,
		)

		if not queries.exists():
			return Response({"detail": "Conversation not found."}, status=status.HTTP_404_NOT_FOUND)

		response_ids = list(
			QueryResponseModel.objects.filter(query__in=queries).values_list("id", flat=True)
		)
		if response_ids:
			QueryResponseModel.objects.filter(id__in=response_ids).delete()

		queries.delete()

		return Response(status=status.HTTP_204_NO_CONTENT)


def _get_feedback_for_query(query):
	feedback = Feedback.objects.filter(query=query, user=query.user).order_by("-created_at").first()
	if not feedback:
		return None
	return {
		"id": str(feedback.id),
		"reaction": feedback.reaction,
		"comment": feedback.comment,
		"created_at": feedback.created_at.isoformat(),
	}


class AIFeedbackView(APIView):
	permission_classes = [IsAuthenticated]
	parser_classes = [JSONParser, MultiPartParser, FormParser]

	def post(self, request):
		query_id = request.data.get("query_id")
		reaction = (request.data.get("reaction") or "like").strip().lower()
		comment = (request.data.get("comment") or "").strip()
		metadata = request.data.get("metadata") or {}

		if reaction not in {Feedback.Reaction.LIKE, Feedback.Reaction.DISLIKE}:
			return Response({"detail": "Invalid reaction."}, status=status.HTTP_400_BAD_REQUEST)

		if not query_id:
			return Response({"detail": "query_id is required."}, status=status.HTTP_400_BAD_REQUEST)

		try:
			query = Query.objects.get(id=query_id, user=request.user)
		except Query.DoesNotExist:
			return Response({"detail": "Conversation not found."}, status=status.HTTP_404_NOT_FOUND)

		response_obj = getattr(query, "response", None)
		feedback = Feedback.objects.create(
			query=query,
			response=response_obj,
			user=request.user,
			reaction=reaction,
			comment=comment,
			metadata=metadata if isinstance(metadata, dict) else {},
			created_by=request.user,
			updated_by=request.user,
		)

		try:
			ai_layer_service.send_feedback(
				query_id=str(query.id),
				response_text=response_obj.response_text if response_obj else query.prompt,
				reaction=reaction,
				comment=comment,
				metadata={
					"feedback_id": str(feedback.id),
					**(metadata if isinstance(metadata, dict) else {}),
				},
			)
		except AILayerError:
			# Persisting feedback is more important than the downstream forward.
			pass

		return Response(
			{
				"id": str(feedback.id),
				"query_id": str(query.id),
				"reaction": feedback.reaction,
				"comment": feedback.comment,
				"created_at": feedback.created_at.isoformat(),
			},
			status=status.HTTP_201_CREATED,
		)
