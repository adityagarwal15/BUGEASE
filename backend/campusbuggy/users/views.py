from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.models import Token
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from django.middleware.csrf import get_token

from .models import User
from .serializers import (
    StudentRegisterSerializer,
    LoginSerializer,
    UserProfileSerializer
)
from .utils.token_utils import get_or_create_token, set_auth_cookie, delete_auth_cookie


class CSRFTokenView(APIView):
    """View to get a CSRF token for forms that require it."""
    permission_classes = [AllowAny]
    
    @method_decorator(ensure_csrf_cookie)
    def get(self, request):
        # Simply getting the token is enough to set the CSRF cookie
        token = get_token(request)
        return Response({"csrfToken": token})


class RegisterStudentView(APIView):
    permission_classes = [AllowAny]
    @swagger_auto_schema(
        request_body=StudentRegisterSerializer,
        responses={201: openapi.Response("Created", UserProfileSerializer)}
    )
    def post(self, request):
        serializer = StudentRegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token = get_or_create_token(user)
            response = Response(
                {"token": token.key, "user_type": user.user_type}, 
                status=status.HTTP_201_CREATED
            )
            
            # Set token in secure cookie
            set_auth_cookie(response, token)
            
            return response
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [AllowAny]
    @swagger_auto_schema(
        request_body=LoginSerializer,
        responses={200: openapi.Response(
            description="Login successful",
            examples={
                "application/json": {
                    "token": "abcd1234",
                    "user_type": "student"
                }
            }
        )}
    )
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            token = get_or_create_token(user)
            
            # Debug information
            print(f"Login successful for user: {user.username}")
            print(f"Setting cookie with token: {token.key[:6]}...")
            print(f"Request headers: {dict(request.headers)}")
            print(f"Origin: {request.headers.get('origin')}")
            print(f"Referer: {request.headers.get('referer')}")
            
            # Setting response with token
            response = Response(
                {"token": token.key, "user_type": user.user_type},
                status=status.HTTP_200_OK
            )
            
            # Set token in secure cookie with SameSite=None for cross-origin requests
            response.set_cookie(
                'auth_token',
                token.key,
                max_age=60 * 60 * 24 * 7,  # 7 days in seconds
                httponly=True,
                secure=False,  # Must be False for HTTP development
                samesite='None',  # Allow cross-origin cookies
                path='/',  # Important: ensure cookie is sent with all paths
                domain=None  # Let browser set the domain automatically
            )
            
            # Add CORS headers explicitly
            response["Access-Control-Allow-Origin"] = request.headers.get('origin', '*')
            response["Access-Control-Allow-Credentials"] = "true"
            
            # Extra debug header to confirm token is actually in the response
            response['X-Debug-Token'] = token.key[:6]
            
            return response
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    @swagger_auto_schema(
        responses={200: openapi.Response("Logged out")}
    )
    def post(self, request):
        if hasattr(request.user, 'auth_token'):
            request.user.auth_token.delete()  # Token deletion = logout
        
        response = Response({"message": "Logged out successfully."}, status=status.HTTP_200_OK)
        delete_auth_cookie(response)
        return response


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    @swagger_auto_schema(
        responses={200: UserProfileSerializer}
    )
    def get(self, request):
        # Debug information
        print(f"Profile request received")
        print(f"Request headers: {dict(request.headers)}")
        print(f"Auth: {request.auth}")
        print(f"User: {request.user}")
        print(f"Cookies: {request.COOKIES}")

        serializer = UserProfileSerializer(request.user)
        response = Response(serializer.data, status=status.HTTP_200_OK)
        
        # Add CORS headers for cross-origin requests
        origin = request.headers.get('origin', '*')
        response["Access-Control-Allow-Origin"] = origin
        response["Access-Control-Allow-Credentials"] = "true"
        response['X-Debug-Token'] = 'profile-accessed'
        
        return response


class RefreshTokenView(APIView):
    """View to refresh authentication token before it expires."""
    permission_classes = [IsAuthenticated]
    
    @swagger_auto_schema(
        responses={200: openapi.Response(
            description="Token refresh successful",
            examples={
                "application/json": {
                    "token": "newtoken1234"
                }
            }
        )}
    )
    def post(self, request):
        # Delete old token
        old_token = None
        if hasattr(request.user, 'auth_token'):
            old_token = request.user.auth_token
            old_token.delete()
        
        # Create new token
        token = Token.objects.create(user=request.user)
        response = Response({"token": token.key}, status=status.HTTP_200_OK)
        
        # Set new token in cookie
        set_auth_cookie(response, token)
        
        return response


class TestCookieView(APIView):
    """Test view for diagnosing cookie issues."""
    permission_classes = [AllowAny]
    
    def get(self, request):
        # Get all cookies
        cookies = request.COOKIES
        
        # Log all cookies received
        print(f"All cookies received: {list(cookies.keys())}")
        print(f"Request headers: {dict(request.headers)}")
        print(f"Origin: {request.headers.get('origin')}")
        print(f"Referer: {request.headers.get('referer')}")
        
        # Create a test cookie
        response = Response({
            "received_cookies": list(cookies.keys()),
            "has_auth_token": "auth_token" in cookies,
            "headers": {k: v for k, v in request.headers.items()},
            "origin": request.headers.get('origin'),
            "referer": request.headers.get('referer')
        })
        
        # Set a test cookie with various SameSite options
        response.set_cookie(
            'test_cookie_lax',
            'test_value',
            max_age=60 * 60,  # 1 hour
            httponly=False,   # Make it readable by JS
            secure=False,     # Allow over HTTP
            samesite='Lax',
            path='/'
        )
        
        response.set_cookie(
            'test_cookie_none',
            'test_value',
            max_age=60 * 60,  # 1 hour
            httponly=False,   # Make it readable by JS
            secure=False,     # Allow over HTTP
            samesite='None',
            path='/'
        )
        
        # Add CORS headers explicitly
        response["Access-Control-Allow-Origin"] = request.headers.get('origin', '*')
        response["Access-Control-Allow-Credentials"] = "true"
        
        return response
