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
    # For debugging, print cookie settings
    print(f"Setting auth cookie: {token.key[:6]}... with secure=False (forced for development)")
    
    # For development, always set secure=False regardless of settings
    # In production, this would use settings.AUTH_COOKIE_SECURE
    response.set_cookie(
        settings.AUTH_COOKIE_NAME,
        token.key,
        max_age=settings.AUTH_COOKIE_MAX_AGE,
        httponly=settings.AUTH_COOKIE_HTTP_ONLY,
        secure=False,  # Force to False for development
        samesite='None',  # Changed from settings to None for cross-origin compatibility
        path='/',  # Ensure cookie is sent with all requests
        domain=None  # Let browser set the domain automatically
    )
    
    # Add CORS headers to ensure cross-origin cookie acceptance
    if "Access-Control-Allow-Origin" not in response:
        response["Access-Control-Allow-Origin"] = "*"
    if "Access-Control-Allow-Credentials" not in response:
        response["Access-Control-Allow-Credentials"] = "true"
        
    return response


def delete_auth_cookie(response):
    """Delete the authentication token cookie from the response."""
    response.delete_cookie(settings.AUTH_COOKIE_NAME)
    return response 