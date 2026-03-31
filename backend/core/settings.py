from pathlib import Path
import os

from dotenv import load_dotenv


BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR.parent / ".env")


SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "django-insecure-acad-assist-change-me")
DEBUG = os.getenv("DJANGO_DEBUG", "False").lower() == "true"
ALLOWED_HOSTS = [host.strip() for host in os.getenv("DJANGO_ALLOWED_HOSTS", "*").split(",") if host.strip()]


INSTALLED_APPS = [
	"django.contrib.admin",
	"django.contrib.auth",
	"django.contrib.contenttypes",
	"django.contrib.sessions",
	"django.contrib.messages",
	"django.contrib.staticfiles",
	"django.contrib.postgres",
	"pgvector.django",
	"rest_framework",
	"apps.users.apps.UsersConfig",
	"apps.academics.apps.AcademicsConfig",
	"apps.files.apps.FilesConfig",
	"apps.knowledge.apps.KnowledgeConfig",
	"apps.notes.apps.NotesConfig",
	"apps.exams.apps.ExamsConfig",
	"apps.analytics.apps.AnalyticsConfig",
	"apps.notifications.apps.NotificationsConfig",
	"apps.queries.apps.QueriesConfig",
]


MIDDLEWARE = [
	"django.middleware.security.SecurityMiddleware",
	"django.contrib.sessions.middleware.SessionMiddleware",
	"django.middleware.common.CommonMiddleware",
	"django.middleware.csrf.CsrfViewMiddleware",
	"django.contrib.auth.middleware.AuthenticationMiddleware",
	"django.contrib.messages.middleware.MessageMiddleware",
	"django.middleware.clickjacking.XFrameOptionsMiddleware",
]


ROOT_URLCONF = "core.urls"


TEMPLATES = [
	{
		"BACKEND": "django.template.backends.django.DjangoTemplates",
		"DIRS": [],
		"APP_DIRS": True,
		"OPTIONS": {
			"context_processors": [
				"django.template.context_processors.request",
				"django.contrib.auth.context_processors.auth",
				"django.contrib.messages.context_processors.messages",
			],
		},
	},
]


WSGI_APPLICATION = "core.wsgi.application"
ASGI_APPLICATION = "core.asgi.application"


DATABASES = {
	"default": {
		"ENGINE": "django.db.backends.postgresql",
		"NAME": os.getenv("POSTGRES_DB", "acad_db"),
		"USER": os.getenv("POSTGRES_USER", "acad_user"),
		"PASSWORD": os.getenv("POSTGRES_PASSWORD", "securepassword"),
		"HOST": os.getenv("POSTGRES_HOST", "db"),
		"PORT": os.getenv("POSTGRES_PORT", "5432"),
		"CONN_MAX_AGE": int(os.getenv("DB_CONN_MAX_AGE", "60")),
	}
}


AUTH_PASSWORD_VALIDATORS = [
	{"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
	{"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
	{"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
	{"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]


LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True


STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"


DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
AUTH_USER_MODEL = "users.User"


REST_FRAMEWORK = {
	"DEFAULT_RENDERER_CLASSES": [
		"rest_framework.renderers.JSONRenderer",
	]
}
