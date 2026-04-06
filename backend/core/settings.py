import os
from datetime import timedelta
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent


SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "change-me-to-a-strong-64-char-secret-key-for-production-use-2026")
DEBUG = os.getenv("DJANGO_DEBUG", "False").lower() == "true"
ALLOWED_HOSTS = [host.strip() for host in os.getenv("DJANGO_ALLOWED_HOSTS", "127.0.0.1,localhost").split(",") if host.strip()]


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


DATABASES = {
	"default": {
		"ENGINE": "django.db.backends.postgresql",
		"NAME": os.getenv("POSTGRES_DB", "app_db"),
		"USER": os.getenv("POSTGRES_USER", "app_user"),
		"PASSWORD": os.getenv("POSTGRES_PASSWORD", "app_password"),
		"HOST": os.getenv("POSTGRES_HOST", "db"),
		"PORT": os.getenv("POSTGRES_PORT", "5432"),
		"CONN_MAX_AGE": int(os.getenv("DB_CONN_MAX_AGE", "120")),
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


CORS_ALLOWED_ORIGINS = [
	origin.strip()
	for origin in os.getenv("DJANGO_CORS_ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")
	if origin.strip()
]

CORS_ALLOWED_ORIGIN_REGEXES = [
	r"^https?://localhost(:\d+)?$",
	r"^https?://127\.0\.0\.1(:\d+)?$",
]

CORS_ALLOW_CREDENTIALS = True


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
