from rest_framework import serializers

from .models import RoleRequest, RoleRequestStatus, User, UserRole
from .services import authenticate_user, register_user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "email", "role", "first_name", "last_name", "date_joined")
        read_only_fields = fields


class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    first_name = serializers.CharField(required=False, allow_blank=True, max_length=150)
    last_name = serializers.CharField(required=False, allow_blank=True, max_length=150)

    def validate_email(self, value: str) -> str:
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("A user with this email already exists")
        return value.lower()

    def create(self, validated_data: dict) -> User:
        return register_user(**validated_data)


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs: dict) -> dict:
        user = authenticate_user(email=attrs["email"].lower(), password=attrs["password"])
        attrs["user"] = user
        return attrs


class RoleRequestSerializer(serializers.ModelSerializer):
    requested_role = serializers.ChoiceField(choices=((UserRole.FACULTY, "Faculty"), (UserRole.HOD, "HOD")))

    class Meta:
        model = RoleRequest
        fields = ("id", "requested_role", "status")
        read_only_fields = ("id", "status")

    def create(self, validated_data: dict) -> RoleRequest:
        user = self.context["request"].user
        return RoleRequest.objects.create(user=user, status=RoleRequestStatus.PENDING, **validated_data)
