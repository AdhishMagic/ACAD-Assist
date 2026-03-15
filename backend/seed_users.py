from django.contrib.auth import get_user_model
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.local')
django.setup()

User = get_user_model()

if not User.objects.filter(email='test@example.com').exists():
    User.objects.create_user('test@example.com', 'testpassword123', name='Test User')
    print("Created test user: test@example.com / testpassword123")
else:
    print("Test user already exists: test@example.com / testpassword123")

if not User.objects.filter(email='admin@example.com').exists():
    User.objects.create_superuser('admin@example.com', 'adminpassword123', name='Admin User')
    print("Created admin user: admin@example.com / adminpassword123")
else:
    print("Admin user already exists: admin@example.com / adminpassword123")
