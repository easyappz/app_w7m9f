from django.urls import path
from .views import (
    HelloView,
    RegisterView,
    LoginView,
    ProfileMeView,
    AdsListCreateView,
    AdRetrieveUpdateDestroyView,
)

urlpatterns = [
    path("hello/", HelloView.as_view(), name="hello"),
    path("auth/register/", RegisterView.as_view(), name="auth-register"),
    path("auth/login/", LoginView.as_view(), name="auth-login"),
    path("profile/me/", ProfileMeView.as_view(), name="profile-me"),
    path("ads/", AdsListCreateView.as_view(), name="ads-list-create"),
    path("ads/<int:pk>/", AdRetrieveUpdateDestroyView.as_view(), name="ads-detail"),
]
