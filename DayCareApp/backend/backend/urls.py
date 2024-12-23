"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers


from app_auth import views
from child_reg.views import ChildViewSet, CheckinViewSet, CurrentlyCheckedViewSet

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'groups', views.GroupViewSet)
router.register(r'staff', views.StaffViewSet, basename="staff")
router.register(r'parents', views.ParentViewSet, basename="parents")
router.register(r'permissions', views.PermissionViewSet)
router.register(r'children', ChildViewSet)
router.register(r'checkin', CheckinViewSet)
router.register(r'checkedin', CurrentlyCheckedViewSet, basename='currently_checked')

urlpatterns = [
    path('', include(router.urls)),
    path('admin/', admin.site.urls),
    path('api/', include('app_auth.urls'))
]
