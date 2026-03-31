import logging

from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User


logger = logging.getLogger("accounts")


def register_user(*, email: str, password: str, first_name: str = "", last_name: str = "") -> User:
    return User.objects.create_user(
        email=email,
        password=password,
        first_name=first_name,
        last_name=last_name,
    )


def authenticate_user(*, email: str, password: str) -> User:
    user = authenticate(username=email, password=password)
    if not user:
        logger.warning("Authentication failed")
        raise AuthenticationFailed("Invalid email or password")
    return user


def generate_tokens_for_user(user: User) -> dict[str, str]:
    refresh = RefreshToken.for_user(user)
    return {
        "access": str(refresh.access_token),
        "refresh": str(refresh),
    }
