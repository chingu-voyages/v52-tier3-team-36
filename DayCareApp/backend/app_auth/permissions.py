from rest_framework import permissions

class IsAdministrator(permissions.BasePermission):
    def has_permission(self, request, view):
        """
        Checks if the request user is a member of the Administrators group.
        Returns True/False
        """
        required_groups = ['Administrators']

        if request.user.is_authenticated:
            return any(group.name in required_groups for group in request.user.groups.all())
        return False
    
class IsStaff(permissions.BasePermission):
    def has_permission(self, request, view):
        """
        Checks if the request user is a member of the Staff group.
        Returns True/False
        """
        required_groups = ['Staff']

        if request.user.is_authenticated:
            return any(group.name in required_groups for group in request.user.groups.all())
        return False
    
class IsParent(permissions.BasePermission):
    def has_permission(self, request, view):
        """
        Checks if the request user is a member of the Parents group.
        Returns True/False
        """
        required_groups = ['Parents']

        if request.user.is_authenticated:
            return any(group.name in required_groups for group in request.user.groups.all())
        return False