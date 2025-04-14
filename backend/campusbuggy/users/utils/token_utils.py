import datetime
from django.conf import settings
from django.utils import timezone
from rest_framework.authtoken.models import Token


def get_token_expiry_time():
    """Return the token expiry time from now."""
    return timezone.now() - datetime.timedelta(days=settings.TOKEN_EXPIRED_AFTER_DAYS)


def token_expire_handler(token):
    """
    Check if the token has expired and return a new one if it has.
    Returns (is_expired, token)
    """
    is_expired = False
    if token:
        expiry = get_token_expiry_time()
        if token.created < expiry:
            # Token has expired
            token.delete()
            token = None
            is_expired = True
    
    return is_expired, token


def get_or_create_token(user):
    """Get an existing valid token or create a new one."""
    token, created = Token.objects.get_or_create(user=user)
    
    # Check if token exists but has expired
    is_expired, token = token_expire_handler(token)
    
    if is_expired:
        # Create a new token
        token = Token.objects.create(user=user)
        
    return token


def set_auth_cookie(response, token):
    """Set the authentication token cookie on the response."""
    response.set_cookie(
        settings.AUTH_COOKIE_NAME,
        token.key,
        max_age=settings.AUTH_COOKIE_MAX_AGE,
        httponly=settings.AUTH_COOKIE_HTTP_ONLY,
        secure=settings.AUTH_COOKIE_SECURE,
        samesite=settings.AUTH_COOKIE_SAMESITE
    )
    return response


def delete_auth_cookie(response):
    """Delete the authentication token cookie from the response."""
    response.delete_cookie(settings.AUTH_COOKIE_NAME)
    return response 