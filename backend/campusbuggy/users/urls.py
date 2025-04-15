from django.urls import path
from .views import (
    RegisterStudentView, 
    LoginView, 
    LogoutView, 
    UserProfileView, 
    CSRFTokenView,
    RefreshTokenView,
    TestCookieView
)

urlpatterns = [
    path('register/', RegisterStudentView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('csrf-token/', CSRFTokenView.as_view(), name='csrf-token'),
    path('refresh-token/', RefreshTokenView.as_view(), name='refresh-token'),
    path('test-cookies/', TestCookieView.as_view(), name='test-cookies'),
]
