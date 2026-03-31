#!/bin/sh
set -e

echo "Waiting for PostgreSQL at ${POSTGRES_HOST}:${POSTGRES_PORT}..."
python - <<'PY'
import os
import time
import psycopg2

host = os.getenv("POSTGRES_HOST", "db")
port = int(os.getenv("POSTGRES_PORT", "5432"))
dbname = os.getenv("POSTGRES_DB", "app_db")
user = os.getenv("POSTGRES_USER", "app_user")
password = os.getenv("POSTGRES_PASSWORD", "app_password")

for attempt in range(60):
	try:
		psycopg2.connect(
			host=host,
			port=port,
			dbname=dbname,
			user=user,
			password=password,
		).close()
		print("PostgreSQL is ready.")
		break
	except psycopg2.OperationalError:
		print(f"PostgreSQL unavailable, retrying ({attempt + 1}/60)...")
		time.sleep(2)
else:
	raise SystemExit("Database is not reachable after retries.")
PY

python manage.py migrate --noinput

if [ -n "$DJANGO_SUPERUSER_EMAIL" ] && [ -n "$DJANGO_SUPERUSER_PASSWORD" ]; then
  python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(email='${DJANGO_SUPERUSER_EMAIL}').exists():
	User.objects.create_superuser(
		email='${DJANGO_SUPERUSER_EMAIL}',
		password='${DJANGO_SUPERUSER_PASSWORD}'
	)
"
fi

python manage.py shell -c "
from django.contrib.auth import get_user_model

User = get_user_model()

seed_accounts = [
	{
		'email': 'student@gmail.com',
		'password': 'Student@123',
		'role': 'student',
		'first_name': 'Student',
		'last_name': 'User',
		'is_staff': False,
		'is_superuser': False,
	},
	{
		'email': 'teacher@gmail.com',
		'password': 'Teacher@123',
		'role': 'teacher',
		'first_name': 'Teacher',
		'last_name': 'User',
		'is_staff': False,
		'is_superuser': False,
	},
	{
		'email': 'hod@gmail.com',
		'password': 'Hod@12345',
		'role': 'hod',
		'first_name': 'HOD',
		'last_name': 'User',
		'is_staff': True,
		'is_superuser': False,
	},
	{
		'email': 'admin@gmail.com',
		'password': 'Admin@123',
		'role': 'admin',
		'first_name': 'Admin',
		'last_name': 'User',
		'is_staff': True,
		'is_superuser': True,
	},
]

for account in seed_accounts:
	password = account.pop('password')
	email = account['email']
	user, created = User.objects.get_or_create(email=email, defaults=account)

	changed = created
	for key, value in account.items():
		if getattr(user, key, None) != value:
			setattr(user, key, value)
			changed = True

	if created or not user.check_password(password):
		user.set_password(password)
		changed = True

	if changed:
		user.save()
"

exec gunicorn core.wsgi:application --bind 0.0.0.0:8000 --workers 3 --timeout 60
