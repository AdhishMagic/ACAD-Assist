import os
from datetime import timedelta
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent
DEFAULT_SECRET_KEY = "change-me-to-a-strong-64-char-secret-key-for-production-use-2026"
# Add 'web' for Docker, 'localhost' and 127.0.0.1 for local development
DEFAULT_ALLOWED_HOSTS = "127.0.0.1,localhost,web,acad_assist_web"


def load_env_file(env_path: Path) -> None:
	if not env_path.exists():
		return

	for raw_line in env_path.read_text(encoding="utf-8").splitlines():
		line = raw_line.strip()
		if not line or line.startswith("#") or "=" not in line:
			continue

		key, value = line.split("=", 1)
		key = key.strip()
		if not key or key in os.environ:
			continue

		os.environ.setdefault(key, value.strip().strip('"').strip("'"))


load_env_file(BASE_DIR.parent / ".env")


def resolve_postgres_host() -> str:
	host = os.getenv("POSTGRES_HOST")
	if host and host != "db":
		return host

	if Path("/.dockerenv").exists():
		return host or "db"

	return "localhost"


def build_database_config() -> dict:
	return {
		"default": {
			"ENGINE": "django.db.backends.postgresql",
			"NAME": os.getenv("POSTGRES_DB", "acad_assist"),
			"USER": os.getenv("POSTGRES_USER", "acad_user"),
			"PASSWORD": os.getenv("POSTGRES_PASSWORD", "acad_pass"),
			"HOST": resolve_postgres_host(),
			"PORT": os.getenv("POSTGRES_PORT", "5432"),
			"CONN_MAX_AGE": int(os.getenv("DB_CONN_MAX_AGE", "120")),
		}
	}


SECRET_KEY = os.getenv(
	"DJANGO_SECRET_KEY",
	os.getenv("SECRET_KEY", DEFAULT_SECRET_KEY),
)
DEBUG = os.getenv("DJANGO_DEBUG", os.getenv("DEBUG", "False")).lower() == "true"
allowed_hosts_value = os.getenv(
	"DJANGO_ALLOWED_HOSTS",
	os.getenv("ALLOWED_HOSTS", DEFAULT_ALLOWED_HOSTS),
)
ALLOWED_HOSTS = [
	host.strip()
	for host in allowed_hosts_value.split(",")
	if host.strip()
]


INSTALLED_APPS = [
	"django.contrib.admin",
	"django.contrib.auth",
	"django.contrib.contenttypes",
	"django.contrib.sessions",
	"django.contrib.messages",
	"django.contrib.staticfiles",
	"corsheaders",
	"rest_framework",
	"rest_framework_simplejwt",
	"accounts.apps.AccountsConfig",
	"apps.academics.apps.AcademicsConfig",
	"apps.analytics.apps.AnalyticsConfig",
	"apps.files.apps.FilesConfig",
	"apps.notifications.apps.NotificationsConfig",
	"apps.queries.apps.QueriesConfig",
	"apps.exams.apps.ExamsConfig",
	"apps.notes.apps.NotesConfig",
	"materials.apps.MaterialsConfig",
	"projects.apps.ProjectsConfig",
]


MIDDLEWARE = [
	"django.middleware.security.SecurityMiddleware",
	"corsheaders.middleware.CorsMiddleware",
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


DATABASES = build_database_config()


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
MEDIA_URL = "/media/"
MEDIA_ROOT = os.path.join(BASE_DIR, "media")


DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
AUTH_USER_MODEL = "accounts.User"
APPEND_SLASH = False


REST_FRAMEWORK = {
	"DEFAULT_AUTHENTICATION_CLASSES": (
		"rest_framework_simplejwt.authentication.JWTAuthentication",
	),
	"DEFAULT_PERMISSION_CLASSES": (
		"rest_framework.permissions.IsAuthenticated",
	),
}


SIMPLE_JWT = {
	"ACCESS_TOKEN_LIFETIME": timedelta(minutes=15),
	"REFRESH_TOKEN_LIFETIME": timedelta(days=7),
	"ROTATE_REFRESH_TOKENS": False,
	"BLACKLIST_AFTER_ROTATION": False,
	"AUTH_HEADER_TYPES": ("Bearer",),
}


CORS_ALLOW_ALL_ORIGINS = False

# Define allowed origins for CORS - includes local development and Docker environments
CORS_ALLOWED_ORIGINS = [
	"http://localhost:5173",
	"http://127.0.0.1:5173",
	"http://localhost:3000",
	"http://127.0.0.1:3000",
]

# Add origins from environment if specified
cors_env_origins = os.getenv("DJANGO_CORS_ALLOWED_ORIGINS", "").strip()
if cors_env_origins:
	CORS_ALLOWED_ORIGINS.extend([
		origin.strip()
		for origin in cors_env_origins.split(",")
		if origin.strip()
	])

# Add Docker-specific origins
if Path("/.dockerenv").exists():
	CORS_ALLOWED_ORIGINS.extend([
		"http://localhost:5173",
		"http://web:5173",
		"http://localhost:3000",
		"http://web:3000",
	])

# Remove duplicates
CORS_ALLOWED_ORIGINS = list(set(CORS_ALLOWED_ORIGINS))

CORS_ALLOWED_ORIGIN_REGEXES = [
	r"^https?://localhost(:\d+)?$",
	r"^https?://127\.0\.0\.1(:\d+)?$",
	r"^https?://web(:\d+)?$",
]

CORS_ALLOW_CREDENTIALS = True

# PDF/media preview is embedded in an iframe on the frontend app.
X_FRAME_OPTIONS = "SAMEORIGIN"


if Path("/.dockerenv").exists():
	_default_ai_layer_query_url = "http://ai-layer:8001/api/query"
	_default_ai_layer_feedback_url = "http://ai-layer:8001/api/feedback"
else:
	_default_ai_layer_query_url = "http://localhost:8001/api/query"
	_default_ai_layer_feedback_url = "http://localhost:8001/api/feedback"

AI_LAYER_QUERY_URL = os.getenv("AI_LAYER_QUERY_URL", _default_ai_layer_query_url)
AI_LAYER_FEEDBACK_URL = os.getenv("AI_LAYER_FEEDBACK_URL", _default_ai_layer_feedback_url)
AI_LAYER_TIMEOUT_SECONDS = float(os.getenv("AI_LAYER_TIMEOUT_SECONDS", "30"))


LOGGING = {
	"version": 1,
	"disable_existing_loggers": False,
	"formatters": {
		"standard": {
			"format": "%(asctime)s %(levelname)s %(name)s %(message)s",
		},
	},
	"handlers": {
		"console": {
			"class": "logging.StreamHandler",
			"formatter": "standard",
		},
	},
	"loggers": {
		"accounts": {
			"handlers": ["console"],
			"level": os.getenv("DJANGO_AUTH_LOG_LEVEL", "INFO"),
			"propagate": False,
		},
		"projects": {
			"handlers": ["console"],
			"level": os.getenv("DJANGO_PROJECTS_LOG_LEVEL", "INFO"),
			"propagate": False,
		},
		"django.request": {
			"handlers": ["console"],
			"level": "ERROR",
			"propagate": True,
		},
	},
	"root": {
		"handlers": ["console"],
		"level": "WARNING",
	},
}
