from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenRefreshView

from .serializers import LoginSerializer, RegisterSerializer, RoleRequestSerializer, UserSerializer
from .services import authenticate_user, generate_tokens_for_user


class RegisterView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            user = serializer.save()
        except ValidationError as exc:
            # Treat duplicate-email registration as an idempotent sign-up when
            # the submitted password matches the existing account.
            email_errors = exc.detail.get("email") if isinstance(exc.detail, dict) else None
            duplicate_email = bool(email_errors) and any(
                "already exists" in str(error).lower() for error in email_errors
            )

            submitted_email = request.data.get("email")
            submitted_password = request.data.get("password")

            if duplicate_email and submitted_email and submitted_password:
                user = authenticate_user(email=submitted_email.lower(), password=submitted_password)
                tokens = generate_tokens_for_user(user)
                return Response(
                    {
                        "user": UserSerializer(user).data,
                        "tokens": tokens,
                        "already_registered": True,
                    },
                    status=status.HTTP_200_OK,
                )

            raise

        tokens = generate_tokens_for_user(user)
        return Response(
            {
                "user": UserSerializer(user).data,
                "tokens": tokens,
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        tokens = generate_tokens_for_user(user)
        return Response(
            {
                "user": UserSerializer(user).data,
                "tokens": tokens,
            },
            status=status.HTTP_200_OK,
        )


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data, status=status.HTTP_200_OK)


class RefreshTokenView(TokenRefreshView):
    permission_classes = [AllowAny]
    authentication_classes = []


class RoleRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = RoleRequestSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        role_request = serializer.save()
        return Response(RoleRequestSerializer(role_request).data, status=status.HTTP_201_CREATED)
