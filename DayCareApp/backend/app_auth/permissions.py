from rest_framework import permissions
from django.contrib.auth.decorators import user_passes_test
from .models import Permission
    
class UsersActions(permissions.BasePermission):
    '''Permission for user actions'''
    def has_permission(self, request, view):
        """
        Checks if the request user group has the permissions to list/edit users.
        Returns True/False
        """
        if request.user.is_authenticated:
            # If supeuser - allow
            if request.user.is_superuser:
                return True
            # If same as the request user - allow changes to own details and password
            if request.user.username == request.data.get('username'):
                return True
            user_groups = request.user.groups.all()
            user_permissions = Permission.objects.filter(group=user_groups[0])
            if request.method == 'GET':
                # Allow listing users
                required_users_permissions = {'list_users': True}
                required_parents_permissions = {'list_parents': True}
                return user_permissions.filter(**required_users_permissions) | user_permissions.filter(**required_parents_permissions)
            else:
                # Allow creating/editing users
                required_permissions = {'edit_users': True}
                return user_permissions.filter(**required_permissions)
        return False
    
class ParentsActions(permissions.BasePermission):
    def has_permission(self, request, view):
        """
        Checks if the request user group has the permissions to list/edit parents.
        Returns True/False
        """
        if request.user.is_authenticated:
            # If superuser - allow
            if request.user.is_superuser:
                return True
            # If the same as the edited object - allow details and password changes
            if request.user.username == request.data.get('username'):
                return True
            user_groups = request.user.groups.all()
            user_permissions = Permission.objects.filter(group=user_groups[0])
            if request.method == 'GET':
                # Allow listing of parents
                required_permissions = {'list_parents': True}
                return user_permissions.filter(**required_permissions)
            else:
                # Allow creating/editing parents
                required_permissions = {'edit_parents': True}
                return user_permissions.filter(**required_permissions)
        return False
    
class ChildrenActions(permissions.BasePermission):
    def has_permission(self, request, view):
        """
        Checks if the request user group has the permissions to list/edit children.
        Returns True/False
        """
        if request.user.is_authenticated:
            # If superuser - allow
            if request.user.is_superuser:
                return True
            user_groups = request.user.groups.all()
            user_permissions = Permission.objects.filter(group=user_groups[0])
            if request.method == 'GET':
                # Allow listing of children
                required_permissions = {'list_children': True}
                return user_permissions.filter(**required_permissions)
            else:
                # Allow creating/editing children
                required_permissions = {'edit_children': True}
                return user_permissions.filter(**required_permissions)
        return False

class OwnChildrenActions(permissions.BasePermission):
    def has_permission(self, request, view):
        """
        Checks if the request user has the permissions to list/edit children.
        Returns True/False
        """
        
        if request.user.is_authenticated:
            if request.user.is_superuser:
                return True
            user_groups = request.user.groups.all()
            user_permissions = Permission.objects.filter(group=user_groups[0])
    
            if request.method == 'GET':
                required_permissions = {'list_own_children': True}
                return user_permissions.filter(**required_permissions)
        return False
    
class OwnChildrenActions(permissions.BasePermission):
    def has_permission(self, request, view):
        """
        Checks if the request user has the permissions to list/edit children.
        Returns True/False
        """
        
        if request.user.is_authenticated:
            if request.user.is_superuser:
                return True
            user_groups = request.user.groups.all()
            user_permissions = Permission.objects.filter(group=user_groups[0])
            
            if request.method == 'GET':
                required_permissions = {'list_own_children': True}
                return user_permissions.filter(**required_permissions)
        return False
    
class ViewStats(permissions.BasePermission):
    def has_permission(self, request, view):
        """
        Checks if the request user group has the permissions to view statistics.
        Returns True/False
        """
        if request.user.is_authenticated:
            # If superuser - allow
            if request.user.is_superuser:
                return True
            user_groups = request.user.groups.all()
            user_permissions = Permission.objects.filter(group=user_groups[0])
            required_permissions = {'view_stats': True}
            return user_permissions.filter(**required_permissions)
        return False
    
class CheckinActions(permissions.BasePermission):
    def has_permission(self, request, view):
        """
        Checks if the request user group has the permissions to check in/out children.
        Returns True/False
        """
        if request.user.is_authenticated:
            # If superuser - allow
            if request.user.is_superuser:
                return True
            user_groups = request.user.groups.all()
            user_permissions = Permission.objects.filter(group__in=user_groups)
            required_permissions = {'check_in': True}
            return user_permissions.filter(**required_permissions)
        return False
    
class ReportCardsActions(permissions.BasePermission):
    def has_permission(self, request, view):
        """
        Checks if the request user group has the permissions to edit report cards.
        Returns True/False
        """
        if request.user.is_authenticated:
            # If superuser - allow
            if request.user.is_superuser:
                return True
            user_groups = request.user.groups.all()
            user_permissions = Permission.objects.filter(group=user_groups[0])
            required_permissions = {'edit_report_cards': True}
            return user_permissions.filter(**required_permissions)
        return False