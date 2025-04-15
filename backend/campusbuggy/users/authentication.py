from django.conf import settings
from django.utils.translation import gettext_lazy as _
from rest_framework import authentication, exceptions
from rest_framework.authtoken.models import Token
from .utils.token_utils import token_expire_handler


class TokenCookieAuthentication(authentication.BaseAuthentication):
    """
    Token authentication based on cookies.
    Clients should authenticate by passing a token in a cookie.
    """
    keyword = 'Token'
    cookie_name = settings.AUTH_COOKIE_NAME
    model = Token

    def get_model(self):
        return self.model

    def authenticate(self, request):
        # Try to get token from cookie first
        auth_token = request.COOKIES.get(self.cookie_name)
        
        # Debug cookie information
        print(f"Cookies received: {request.COOKIES.keys()}")
        print(f"Headers: {dict(request.headers)}")
        print(f"Origin: {request.headers.get('origin')}")
        
        # If no cookie token, try Authorization header as fallback
        if not auth_token:
            print(f"Auth token missing in cookies. Expected cookie name: {self.cookie_name}")
            auth_header = request.META.get('HTTP_AUTHORIZATION', '')
            if auth_header.startswith(self.keyword):
                print(f"Using Authorization header as fallback")
                auth_token = auth_header.split(' ')[1]
            else:
                # Still no token found
                return None
        else:
            print(f"Auth token found in cookies: {auth_token[:6]}...")
        
        return self.authenticate_credentials(auth_token)

    def authenticate_credentials(self, key):
        model = self.get_model()
        try:
            token = model.objects.select_related('user').get(key=key)
        except model.DoesNotExist:
            raise exceptions.AuthenticationFailed(_('Invalid token.'))

        if not token.user.is_active:
            raise exceptions.AuthenticationFailed(_('User inactive or deleted.'))
            
        # Check if token has expired
        is_expired, token = token_expire_handler(token)
        if is_expired:
            raise exceptions.AuthenticationFailed(_('Token has expired.'))

        return (token.user, token)

    def authenticate_header(self, request):
        return self.keyword 