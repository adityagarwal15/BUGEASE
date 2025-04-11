from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.models import Token
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from .models import User
from .serializers import (
    StudentRegisterSerializer,
    LoginSerializer,
    UserProfileSerializer
)


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
            token, _ = Token.objects.get_or_create(user=user)
            return Response({"token": token.key}, status=status.HTTP_201_CREATED)
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
            token, _ = Token.objects.get_or_create(user=user)
            return Response({"token": token.key, "user_type": user.user_type}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    @swagger_auto_schema(
        responses={200: openapi.Response("Logged out")}
    )
    def post(self, request):
        request.user.auth_token.delete()  # Token deletion = logout
        return Response({"message": "Logged out successfully."}, status=status.HTTP_200_OK)


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    @swagger_auto_schema(
        responses={200: UserProfileSerializer}
    )
    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)
