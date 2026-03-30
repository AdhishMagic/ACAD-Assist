#!/bin/sh
set -e

echo "Waiting for PostgreSQL at ${POSTGRES_HOST}:${POSTGRES_PORT}..."
until nc -z "$POSTGRES_HOST" "$POSTGRES_PORT"; do
  sleep 1
done

echo "PostgreSQL is ready."

python manage.py makemigrations users academics queries --noinput
python manage.py migrate --noinput

exec python manage.py runserver 0.0.0.0:8000
