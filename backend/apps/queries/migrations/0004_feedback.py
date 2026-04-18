import uuid
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

	dependencies = [
		('queries', '0003_alter_query_options_alter_response_options_and_more'),
		migrations.swappable_dependency(settings.AUTH_USER_MODEL),
	]

	operations = [
		migrations.CreateModel(
			name='Feedback',
			fields=[
				('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
				('created_at', models.DateTimeField(auto_now_add=True, db_index=True)),
				('updated_at', models.DateTimeField(auto_now=True)),
				('deleted_at', models.DateTimeField(blank=True, db_index=True, null=True)),
				('reaction', models.CharField(choices=[('like', 'Like'), ('dislike', 'Dislike')], db_index=True, max_length=20)),
				('comment', models.TextField(blank=True)),
				('metadata', models.JSONField(blank=True, default=dict)),
				('created_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to=settings.AUTH_USER_MODEL)),
				('query', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='feedback_entries', to='queries.query')),
				('response', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='feedback_entries', to='queries.response')),
				('updated_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to=settings.AUTH_USER_MODEL)),
				('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='query_feedback', to=settings.AUTH_USER_MODEL)),
			],
			options={
				'ordering': ['-created_at'],
				'verbose_name': 'Feedback',
				'verbose_name_plural': 'Feedback',
			},
		),
		migrations.AddIndex(
			model_name='feedback',
			index=models.Index(fields=['query'], name='idx_feedback_query'),
		),
		migrations.AddIndex(
			model_name='feedback',
			index=models.Index(fields=['user'], name='idx_feedback_user'),
		),
	]
