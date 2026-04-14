from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

	dependencies = [
		("files", "0003_alter_file_options_alter_file_checksum_and_more"),
		migrations.swappable_dependency(settings.AUTH_USER_MODEL),
	]

	operations = [
		migrations.RemoveIndex(
			model_name="file",
			name="idx_file_owner",
		),
		migrations.RenameField(
			model_name="file",
			old_name="owner",
			new_name="uploaded_by",
		),
		migrations.RenameField(
			model_name="file",
			old_name="filename",
			new_name="original_name",
		),
		migrations.AddField(
			model_name="file",
			name="file",
			field=models.FileField(blank=True, null=True, upload_to="uploads/%Y/%m/%d/"),
		),
		migrations.AddField(
			model_name="file",
			name="file_type",
			field=models.CharField(default="pdf", max_length=20),
		),
		migrations.AddField(
			model_name="file",
			name="is_editable",
			field=models.BooleanField(default=False),
		),
		migrations.AlterField(
			model_name="file",
			name="checksum",
			field=models.CharField(db_index=True, max_length=128),
		),
		migrations.AddIndex(
			model_name="file",
			index=models.Index(fields=["uploaded_by"], name="idx_file_uploaded_by"),
		),
		migrations.AddIndex(
			model_name="file",
			index=models.Index(fields=["file_type"], name="idx_file_type"),
		),
	]