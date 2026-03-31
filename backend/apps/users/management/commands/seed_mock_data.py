from django.core.management.base import BaseCommand
from django.db import transaction

from apps.academics.models import Material, Subject
from apps.queries.models import Query, Response
from apps.users.models import User
from db_design.constants import ApprovalStatus, QueryStatus, UserRole


class Command(BaseCommand):
	help = "Seed initial mock data for ACAD Assist"

	@transaction.atomic
	def handle(self, *args, **options):
		admin_user, _ = User.all_objects.get_or_create(
			username="admin",
			defaults={
				"email": "admin@acadassist.local",
				"role": UserRole.ADMIN,
				"is_staff": True,
				"is_superuser": True,
			},
		)
		if not admin_user.check_password("admin123"):
			admin_user.set_password("admin123")
			admin_user.save(update_fields=["password", "updated_at"])

		teacher, _ = User.all_objects.get_or_create(
			username="teacher1",
			defaults={
				"email": "teacher1@acadassist.local",
				"role": UserRole.TEACHER,
				"is_staff": True,
			},
		)
		if not teacher.check_password("teacher123"):
			teacher.set_password("teacher123")
			teacher.save(update_fields=["password", "updated_at"])

		student1, _ = User.all_objects.get_or_create(
			username="student1",
			defaults={"email": "student1@acadassist.local", "role": UserRole.STUDENT},
		)
		if not student1.check_password("student123"):
			student1.set_password("student123")
			student1.save(update_fields=["password", "updated_at"])

		student2, _ = User.all_objects.get_or_create(
			username="student2",
			defaults={"email": "student2@acadassist.local", "role": UserRole.STUDENT},
		)
		if not student2.check_password("student123"):
			student2.set_password("student123")
			student2.save(update_fields=["password", "updated_at"])

		algo, _ = Subject.objects.get_or_create(
			code="CS301",
			defaults={
				"name": "Algorithms",
				"description": "Foundations of algorithm design and analysis.",
				"created_by": teacher,
				"updated_by": teacher,
			},
		)
		ml, _ = Subject.objects.get_or_create(
			code="CS450",
			defaults={
				"name": "Machine Learning",
				"description": "Supervised and unsupervised ML concepts.",
				"created_by": teacher,
				"updated_by": teacher,
			},
		)

		Material.objects.get_or_create(
			subject=algo,
			title="Sorting Algorithms Notes",
			defaults={
				"description": "Merge sort, quicksort, and heap sort overview.",
				"storage_path": "materials/cs301/sorting.pdf",
				"status": ApprovalStatus.APPROVED,
				"metadata": {"pages": 42},
				"created_by": teacher,
				"updated_by": teacher,
			},
		)
		Material.objects.get_or_create(
			subject=ml,
			title="Neural Networks Intro",
			defaults={
				"description": "Introductory lecture slides for neural networks.",
				"storage_path": "materials/cs450/nn-intro.pdf",
				"status": ApprovalStatus.PENDING,
				"metadata": {"pages": 28},
				"created_by": teacher,
				"updated_by": teacher,
			},
		)

		sample_query, _ = Query.objects.get_or_create(
			user=student1,
			prompt="Explain the time complexity of merge sort.",
			defaults={
				"context": {"subject": "CS301"},
				"status": QueryStatus.ANSWERED,
				"created_by": student1,
				"updated_by": student1,
			},
		)
		Response.objects.get_or_create(
			query=sample_query,
			defaults={
				"responder": teacher,
				"response_text": "Merge sort runs in O(n log n) time in best, average, and worst cases.",
				"latency_ms": 122,
				"model_name": "llama3",
				"token_usage": {"input": 31, "output": 22},
				"created_by": teacher,
				"updated_by": teacher,
			},
		)

		sample_query_two, _ = Query.objects.get_or_create(
			user=student2,
			prompt="What is overfitting in machine learning?",
			defaults={
				"context": {"subject": "CS450"},
				"status": QueryStatus.ANSWERED,
				"created_by": student2,
				"updated_by": student2,
			},
		)
		Response.objects.get_or_create(
			query=sample_query_two,
			defaults={
				"responder": teacher,
				"response_text": "Overfitting happens when a model memorizes training data and generalizes poorly.",
				"latency_ms": 145,
				"model_name": "mistral",
				"token_usage": {"input": 26, "output": 19},
				"created_by": teacher,
				"updated_by": teacher,
			},
		)

		self.stdout.write(self.style.SUCCESS("Mock data seeded successfully."))
