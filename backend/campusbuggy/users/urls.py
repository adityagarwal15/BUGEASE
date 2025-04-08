from django.urls import path
from .views import RegisterStudentView, LoginView, LogoutView, UserProfileView

urlpatterns = [
    path('register/', RegisterStudentView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('profile/', UserProfileView.as_view(), name='profile'),
]
