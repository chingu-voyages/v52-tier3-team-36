from django.urls import path
from .views import CustomTokenObtainPairView, CustomRefreshTokenView, change_password, reset_password, logout, is_authenticated, register

urlpatterns = [
    #Path to obtain new tokens - used for user login
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', CustomRefreshTokenView.as_view(), name='token_refresh'),
    path('logout/', logout),
    path('authenticated/', is_authenticated),
    path('register/', register),
    path('change-password/', change_password, name='change-password'),
    path('reset-password/', reset_password, name='reset-password')
]