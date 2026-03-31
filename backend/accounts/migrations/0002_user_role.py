from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("accounts", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="user",
            name="role",
            field=models.CharField(
                choices=[
                    ("student", "Student"),
                    ("teacher", "Teacher"),
                    ("hod", "HOD"),
                    ("admin", "Admin"),
                ],
                db_index=True,
                default="student",
                max_length=20,
            ),
        ),
    ]
