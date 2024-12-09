from rest_framework import permissions
from django.contrib.auth.decorators import user_passes_test
from .models import Permission
    
class UsersActions(permissions.BasePermission):
    def has_permission(self, request, view):
        """
        Checks if the request user has the permissions to list/edit users.
        Returns True/False
        """
        if request.user.is_authenticated:
            if user_passes_test(lambda u: u.is_superuser):
                return True
            if request.user.username == request.data.get('username'):
                return True
            user_groups = request.user.groups.all()
            user_permissions = Permission.objects.filter(group=user_groups[0])
            if request.GET:
                required_permissions = {'list_users': True}
                return user_permissions.filter(**required_permissions)
            else:
                required_permissions = {'edit_users': True}
                return user_permissions.filter(**required_permissions)
        return False
    
class ParentsActions(permissions.BasePermission):
    def has_permission(self, request, view):
        """
        Checks if the request user has the permissions to list/edit parents.
        Returns True/False
        """
        if request.user.is_authenticated:
            if user_passes_test(lambda u: u.is_superuser):
                return True
            if request.user.username == request.data.get('username'):
                return True
            user_groups = request.user.groups.all()
            user_permissions = Permission.objects.filter(group=user_groups[0])
            if request.GET:
                required_permissions = {'list_parents': True}
                return user_permissions.filter(**required_permissions)
            else:
                required_permissions = {'edit_parents': True}
                return user_permissions.filter(**required_permissions)
        return False
    
class ChildrenActions(permissions.BasePermission):
    def has_permission(self, request, view):
        """
        Checks if the request user has the permissions to list/edit children.
        Returns True/False
        """
        if request.user.is_authenticated:
            if user_passes_test(lambda u: u.is_superuser):
                return True
            user_groups = request.user.groups.all()
            user_permissions = Permission.objects.filter(group=user_groups[0])
            if request.GET:
                required_permissions = {'list_children': True}
                return user_permissions.filter(**required_permissions)
            else:
                required_permissions = {'edit_children': True}
                return user_permissions.filter(**required_permissions)
        return False
    
class ViewStats(permissions.BasePermission):
    def has_permission(self, request, view):
        """
        Checks if the request user has the permissions to view statistics.
        Returns True/False
        """
        if request.user.is_authenticated:
            if user_passes_test(lambda u: u.is_superuser):
                return True
            user_groups = request.user.groups.all()
            user_permissions = Permission.objects.filter(group=user_groups[0])
            required_permissions = {'view_stats': True}
            return user_permissions.filter(**required_permissions)
        return False
    
class CheckinActions(permissions.BasePermission):
    def has_permission(self, request, view):
        """
        Checks if the request user has the permissions to check in/out children.
        Returns True/False
        """
        if request.user.is_authenticated:
            if user_passes_test(lambda u: u.is_superuser):
                return True
            user_groups = request.user.groups.all()
            user_permissions = Permission.objects.filter(group=user_groups[0])
            required_permissions = {'check_in': True}
            return user_permissions.filter(**required_permissions)
        return False
    
class ReportCardsActions(permissions.BasePermission):
    def has_permission(self, request, view):
        """
        Checks if the request user has the permissions to edit report cards.
        Returns True/False
        """
        if request.user.is_authenticated:
            if user_passes_test(lambda u: u.is_superuser):
                return True
            user_groups = request.user.groups.all()
            user_permissions = Permission.objects.filter(group=user_groups[0])
            required_permissions = {'edit_report_cards': True}
            return user_permissions.filter(**required_permissions)
        return False