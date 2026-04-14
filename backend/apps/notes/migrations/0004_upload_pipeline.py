from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

	dependencies = [
		("files", "0004_upload_pipeline"),
		("notes", "0003_alter_note_options_alter_note_created_by_and_more"),
		migrations.swappable_dependency(settings.AUTH_USER_MODEL),
	]

	operations = [
		migrations.RemoveIndex(
			model_name="note",
			name="idx_note_user",
		),
		migrations.RemoveField(
			model_name="note",
			name="user",
		),
		migrations.RenameField(
			model_name="note",
			old_name="body",
			new_name="content",
		),
		migrations.AddField(
			model_name="note",
			name="file",
			field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name="notes", to="files.file"),
		),
		migrations.AddField(
			model_name="note",
			name="is_published",
			field=models.BooleanField(default=False),
		),
		migrations.AddIndex(
			model_name="note",
			index=models.Index(fields=["created_by"], name="idx_note_created_by"),
		),
		migrations.AddIndex(
			model_name="note",
			index=models.Index(fields=["file"], name="idx_note_file"),
		),
		migrations.AddIndex(
			model_name="note",
			index=models.Index(fields=["is_published"], name="idx_note_published"),
		),
	]