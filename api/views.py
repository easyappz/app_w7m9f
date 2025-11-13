from datetime import datetime
from django.utils import timezone
from django.db.models import Q
from rest_framework import generics, permissions, status, serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema

from .models import Ad, Member
from .serializers import (
    MessageSerializer,
    RegisterSerializer,
    LoginSerializer,
    MemberPrivateSerializer,
    MemberPublicSerializer,
    AdSerializer,
)
from .auth import create_access_token


class HelloView(APIView):
    """A simple API endpoint that returns a greeting message."""

    @extend_schema(responses={200: MessageSerializer}, description="Get a hello world message")
    def get(self, request):
        data = {"message": "Hello!", "timestamp": timezone.now()}
        serializer = MessageSerializer(data)
        return Response(serializer.data)


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    @extend_schema(request=RegisterSerializer, responses={201: MemberPrivateSerializer})
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        member = serializer.save()
        return Response(MemberPrivateSerializer(member).data, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    class TokenResponseSerializer(serializers.Serializer):
        token = serializers.CharField()
        member = MemberPrivateSerializer()

    @extend_schema(request=LoginSerializer, responses={200: TokenResponseSerializer})
    def post(self, request):
        login_ser = LoginSerializer(data=request.data)
        login_ser.is_valid(raise_exception=True)
        member = login_ser.validated_data["member"]
        token = create_access_token(member.id)
        return Response({"token": token, "member": MemberPrivateSerializer(member).data})


class ProfileMeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(responses={200: MemberPrivateSerializer})
    def get(self, request):
        return Response(MemberPrivateSerializer(request.user).data)

    @extend_schema(request=MemberPrivateSerializer, responses={200: MemberPrivateSerializer})
    def patch(self, request):
        ser = MemberPrivateSerializer(request.user, data=request.data, partial=True)
        ser.is_valid(raise_exception=True)
        ser.save()
        return Response(ser.data)


class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return getattr(obj, "author_id", None) == getattr(request.user, "id", None)


class AdsListCreateView(generics.ListCreateAPIView):
    queryset = Ad.objects.all().order_by("-created_at")
    serializer_class = AdSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    @extend_schema(
        parameters=[],
        responses={200: AdSerializer(many=True)},
        description="List ads with filters by category, price, date, and title search",
    )
    def get(self, request, *args, **kwargs):
        qs = self.get_queryset()
        category = request.query_params.get("category")
        price_min = request.query_params.get("price_min")
        price_max = request.query_params.get("price_max")
        date_from = request.query_params.get("date_from")
        date_to = request.query_params.get("date_to")
        search = request.query_params.get("search")

        if category:
            qs = qs.filter(category=category)
        if price_min:
            try:
                qs = qs.filter(price__gte=float(price_min))
            except Exception:
                pass
        if price_max:
            try:
                qs = qs.filter(price__lte=float(price_max))
            except Exception:
                pass
        if date_from:
            try:
                dt = datetime.fromisoformat(date_from)
                if timezone.is_naive(dt):
                    dt = timezone.make_aware(dt, timezone.get_current_timezone())
                qs = qs.filter(created_at__gte=dt)
            except Exception:
                pass
        if date_to:
            try:
                dt = datetime.fromisoformat(date_to)
                if timezone.is_naive(dt):
                    dt = timezone.make_aware(dt, timezone.get_current_timezone())
                qs = qs.filter(created_at__lte=dt)
            except Exception:
                pass
        if search:
            qs = qs.filter(title__icontains=search)

        page = self.paginate_queryset(qs)
        if page is not None:
            ser = self.get_serializer(page, many=True)
            return self.get_paginated_response(ser.data)
        ser = self.get_serializer(qs, many=True)
        return Response(ser.data)

    @extend_schema(request=AdSerializer, responses={201: AdSerializer})
    def post(self, request, *args, **kwargs):
        ser = self.get_serializer(data=request.data)
        ser.is_valid(raise_exception=True)
        ad = ser.save(author=request.user)
        return Response(self.get_serializer(ad).data, status=status.HTTP_201_CREATED)


class AdRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Ad.objects.all()
    serializer_class = AdSerializer

    def get_permissions(self):
        if self.request.method in ["GET"]:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated(), IsOwnerOrReadOnly()]
