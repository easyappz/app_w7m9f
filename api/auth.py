import base64
import hmac
import hashlib
import json
import time
from typing import Optional, Tuple

from django.conf import settings
from rest_framework.authentication import BaseAuthentication, get_authorization_header
from rest_framework.exceptions import AuthenticationFailed
from .models import Member


ALGORITHM = "HS256"
SECRET = settings.SECRET_KEY.encode()


def _b64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode()


def _b64url_decode(s: str) -> bytes:
    padding = '=' * (-len(s) % 4)
    return base64.urlsafe_b64decode(s + padding)


def create_access_token(member_id: int, ttl_seconds: int = 60 * 60 * 24 * 7) -> str:
    header = {"alg": ALGORITHM, "typ": "JWT"}
    payload = {"sub": member_id, "exp": int(time.time()) + ttl_seconds}
    header_b64 = _b64url_encode(json.dumps(header, separators=(",", ":")).encode())
    payload_b64 = _b64url_encode(json.dumps(payload, separators=(",", ":")).encode())
    signing_input = f"{header_b64}.{payload_b64}".encode()
    signature = hmac.new(SECRET, signing_input, hashlib.sha256).digest()
    signature_b64 = _b64url_encode(signature)
    return f"{header_b64}.{payload_b64}.{signature_b64}"


def decode_token(token: str) -> dict:
    try:
        header_b64, payload_b64, signature_b64 = token.split(".")
    except ValueError:
        raise AuthenticationFailed("Invalid token format")

    signing_input = f"{header_b64}.{payload_b64}".encode()
    expected_sig = hmac.new(SECRET, signing_input, hashlib.sha256).digest()
    try:
        provided_sig = _b64url_decode(signature_b64)
    except Exception:
        raise AuthenticationFailed("Invalid token signature encoding")

    if not hmac.compare_digest(expected_sig, provided_sig):
        raise AuthenticationFailed("Invalid token signature")

    try:
        payload = json.loads(_b64url_decode(payload_b64))
    except Exception:
        raise AuthenticationFailed("Invalid token payload")

    if int(time.time()) >= int(payload.get("exp", 0)):
        raise AuthenticationFailed("Token has expired")

    return payload


class JWTAuthentication(BaseAuthentication):
    keyword = b"Bearer"

    def authenticate(self, request) -> Optional[Tuple[Member, None]]:
        auth = get_authorization_header(request).split()
        if not auth or auth[0].lower() != self.keyword.lower():
            return None
        if len(auth) == 1:
            raise AuthenticationFailed("Invalid Authorization header. No credentials provided.")
        if len(auth) > 2:
            raise AuthenticationFailed("Invalid Authorization header.")
        token = auth[1].decode()
        payload = decode_token(token)
        member_id = payload.get("sub")
        try:
            member = Member.objects.get(id=member_id)
        except Member.DoesNotExist:
            raise AuthenticationFailed("User not found")
        return (member, None)

    def authenticate_header(self, request) -> str:
        return "Bearer"
