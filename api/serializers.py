from django.contrib.auth.hashers import make_password, check_password
from rest_framework import serializers
from .models import Member, Ad


class MessageSerializer(serializers.Serializer):
    message = serializers.CharField(max_length=200)
    timestamp = serializers.DateTimeField(read_only=True)


class MemberPublicSerializer(serializers.ModelSerializer):
    registered_at = serializers.DateTimeField(source="created_at", read_only=True)

    class Meta:
        model = Member
        fields = ["id", "name", "phone", "about", "registered_at"]
        read_only_fields = fields


class MemberPrivateSerializer(serializers.ModelSerializer):
    registered_at = serializers.DateTimeField(source="created_at", read_only=True)

    class Meta:
        model = Member
        fields = ["id", "username", "name", "phone", "about", "registered_at"]
        read_only_fields = ["id", "registered_at", "username"]


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(write_only=True, min_length=6)
    name = serializers.CharField(max_length=150)
    phone = serializers.CharField(max_length=50)

    def validate_username(self, value):
        if Member.objects.filter(username=value).exists():
            raise serializers.ValidationError("Пользователь с таким логином уже существует")
        return value

    def create(self, validated_data):
        member = Member(
            username=validated_data["username"],
            password=make_password(validated_data["password"]),
            name=validated_data["name"],
            phone=validated_data["phone"],
        )
        member.save()
        return member


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        username = attrs.get("username")
        password = attrs.get("password")
        try:
            member = Member.objects.get(username=username)
        except Member.DoesNotExist:
            raise serializers.ValidationError({"detail": "Неверный логин или пароль"})
        if not check_password(password, member.password):
            raise serializers.ValidationError({"detail": "Неверный логин или пароль"})
        attrs["member"] = member
        return attrs


class AdSerializer(serializers.ModelSerializer):
    author = MemberPublicSerializer(read_only=True)

    class Meta:
        model = Ad
        fields = [
            "id",
            "title",
            "description",
            "price",
            "contact_phone",
            "category",
            "author",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "author", "created_at", "updated_at"]
