#!/bin/sh
set -e

echo "Waiting for PostgreSQL at ${POSTGRES_HOST}:${POSTGRES_PORT}..."
python - <<'PY'
import os
import time
import psycopg2

host = os.getenv("POSTGRES_HOST", "db")
port = int(os.getenv("POSTGRES_PORT", "5432"))
dbname = os.getenv("POSTGRES_DB", "acad_db")
user = os.getenv("POSTGRES_USER", "acad_user")
password = os.getenv("POSTGRES_PASSWORD", "securepassword")

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

python manage.py makemigrations
python manage.py migrate --noinput

if [ -n "$DJANGO_SUPERUSER_USERNAME" ] && [ -n "$DJANGO_SUPERUSER_EMAIL" ] && [ -n "$DJANGO_SUPERUSER_PASSWORD" ]; then
  python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='${DJANGO_SUPERUSER_USERNAME}').exists():
	User.objects.create_superuser(
		username='${DJANGO_SUPERUSER_USERNAME}',
		email='${DJANGO_SUPERUSER_EMAIL}',
		password='${DJANGO_SUPERUSER_PASSWORD}'
	)
"
fi

exec python manage.py runserver 0.0.0.0:8000
