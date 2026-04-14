# Generated migration for bookmarked_notes field

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0003_role_request_and_update_user_role'),
        ('notes', '0001_initial'),  # Ensure notes app is initialized
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='bookmarked_notes',
            field=models.ManyToManyField(blank=True, related_name='bookmarked_by', to='notes.note'),
        ),
    ]
