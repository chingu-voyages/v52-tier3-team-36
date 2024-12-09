from django.urls import path
from .views import CustomTokenObtainPairView, CustomRefreshTokenView, change_password, reset_password, logout, is_authenticated, register

urlpatterns = [
    #Path to obtain new tokens - used for user login
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    # Path to refresh tokens
    path('token/refresh/', CustomRefreshTokenView.as_view(), name='token_refresh'),
    # Path to logout and delete cookies
    path('logout/', logout),
    # Path to check if a user is logged in - returns a user instance with permissions
    path('authenticated/', is_authenticated),
    # Path to register new users
    path('register/', register),
    # Path to self password change
    path('change-password/', change_password, name='change-password'),
    # Path to admin password reset
    path('reset-password/', reset_password, name='reset-password')
]