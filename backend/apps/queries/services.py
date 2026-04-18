import json
import urllib.error
import urllib.request

from django.conf import settings


class AILayerError(Exception):
	"""Raised when the AI layer cannot be reached or returns invalid data."""


class AILayerService:
	@staticmethod
	def ask(question: str, context: str | None = None) -> dict:
		payload = {
			"question": question,
			"context": context,
		}
		data = json.dumps(payload).encode("utf-8")
		request = urllib.request.Request(
			settings.AI_LAYER_QUERY_URL,
			data=data,
			headers={"Content-Type": "application/json"},
			method="POST",
		)

		try:
			with urllib.request.urlopen(request, timeout=settings.AI_LAYER_TIMEOUT_SECONDS) as response:
				raw = response.read().decode("utf-8")
		except urllib.error.URLError as exc:
			raise AILayerError(f"AI layer request failed: {exc}") from exc

		try:
			parsed = json.loads(raw) if raw else {}
		except json.JSONDecodeError as exc:
			raise AILayerError("AI layer returned invalid JSON") from exc

		if not isinstance(parsed, dict):
			raise AILayerError("AI layer response must be a JSON object")

		return parsed

	@staticmethod
	def send_feedback(query_id: str, response_text: str, reaction: str, comment: str = "", metadata: dict | None = None) -> dict:
		payload = {
			"query_id": query_id,
			"response_text": response_text,
			"reaction": reaction,
			"comment": comment,
			"metadata": metadata or {},
		}
		data = json.dumps(payload).encode("utf-8")
		request = urllib.request.Request(
			settings.AI_LAYER_FEEDBACK_URL,
			data=data,
			headers={"Content-Type": "application/json"},
			method="POST",
		)

		try:
			with urllib.request.urlopen(request, timeout=settings.AI_LAYER_TIMEOUT_SECONDS) as response:
				raw = response.read().decode("utf-8")
		except urllib.error.URLError as exc:
			raise AILayerError(f"AI layer feedback request failed: {exc}") from exc

		try:
			parsed = json.loads(raw) if raw else {}
		except json.JSONDecodeError as exc:
			raise AILayerError("AI layer feedback returned invalid JSON") from exc

		if not isinstance(parsed, dict):
			raise AILayerError("AI layer feedback response must be a JSON object")

		return parsed


ai_layer_service = AILayerService()
