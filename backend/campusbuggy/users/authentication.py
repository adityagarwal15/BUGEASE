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
        auth_token = request.COOKIES.get(self.cookie_name)
        
        if not auth_token:
            return None
            
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