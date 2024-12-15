from django.contrib.auth.models import Group, User
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializer, GroupSerializer, UserRegistrationSerializer, ChangePasswordSerializer, ResetPasswordSerializer, PermissionSerializer
from .permissions import UsersActions, ParentsActions
from .models import Permission
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

class CustomTokenObtainPairView(TokenObtainPairView):
    '''View to obtain access and refresh tokens from SimpleJWT, and set a cookie containing the tokens. Creates an HTTP-only cookie'''
    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)
            tokens = response.data
            
            access_token = tokens['access']
            refresh_token = tokens['refresh']

            res = Response()

            res.data = {'success': True}

            res.set_cookie(
                key="access_token",
                value=access_token,
                httponly=True,
                secure=True,
                samesite='None',
                path='/'
            )

            res.set_cookie(
                key="refresh_token",
                value=refresh_token,
                httponly=True,
                secure=True,
                samesite='None',
                path='/'
            )

            return res
        except:
            return Response({'success': False})
        
class CustomRefreshTokenView(TokenRefreshView):
    '''View to refresh an access token using a valid refresh token'''
    def post(self, request, *args, **kwargs):
        try:
            #Get the refresh token from the cookie
            refresh_token = request.COOKIES.get('refresh_token')
            request.data['refresh'] = refresh_token

            response = super().post(request, *args, **kwargs)
            tokens = response.data
            access_token = tokens['access']

            res = Response()
            res.data = {'refreshed': True}
            #Create new cookie with the new token
            res.set_cookie(
                key="access_token",
                value=access_token,
                httponly=True,
                secure=True,
                samesite='None',
                path='/'
            )

            res.set_cookie(
                key="refresh_token",
                value=refresh_token,
                httponly=True,
                secure=True,
                samesite='None',
                path='/'
            )

            return res
        except:
            return Response({'refreshed': False})
        
@api_view(['POST'])
@permission_classes([UsersActions])
def register(request):
    '''API endpoint for user registration. 
    Expects {
    username,
    password,
    first_name,
    last_name,
    email,
    groups: [group.id,...]}
    => {
    username,
    first_name,
    last_name,
    email,
    is_active,
    groups: [group.id,...]}'''
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors)

@api_view(['POST'])
@permission_classes([UsersActions])
def change_password(request):
    '''API endpoint for self password change.
    Expects current and new password, along with the username.
    Returns success'''
    serializer = ChangePasswordSerializer(data=request.data)
    if serializer.is_valid():
        user = User.objects.get(username=serializer.validated_data['username'])

        if not user.check_password(serializer.validated_data['old_password']):
            return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(serializer.validated_data['new_password'])
        user.save()
        return Response({"message": "Password updated successfully"}, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
@permission_classes([UsersActions])
def reset_password(request):
    '''API endpoint for admin password reset.
    Expects username and new password.
    Returns success'''
    serializer = ResetPasswordSerializer(data=request.data)
    if serializer.is_valid():
        user = User.objects.get(username=serializer.validated_data['username'])

        user.set_password(serializer.validated_data['new_password'])
        user.save()
        return Response({"message": "Password updated successfully"}, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    '''API endpoint to delete cookies after user logout'''
    try:
        res = Response()
        res.data = {'success': True}
        res.delete_cookie('access_token', path='/', samesite='None')
        res.delete_cookie('refresh_token', path='/', samesite='None')
        return res
    except:
        return {'success': False}
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def is_authenticated(request):
    '''API endpoint to check if the request is coming from an authenticated user.
    Returns user info with permissions'''
    user = request.user
    # Get the groups for the request user
    group_ids = [group.id for group in user.groups.all()]
    # Get the permission for the group
    perm_filtered = Permission.objects.filter(group__in=group_ids) if len(group_ids) > 0 else Permission.objects.filter(group=1)
    # If superuser - allow all, if new user - return an object with blank permissions
    perm_json = [{
            "list_users": True,
            "edit_users": True,
            "edit_parents": True,
            "list_parents": True,
            "list_children": True,
            "edit_report_cards": True,
            "list_own_children": True,
            "edit_children": True,
            "check_in": True,
            "view_stats": True
    }] if request.user.is_superuser else PermissionSerializer(perm_filtered, many=True).data
    perm_validated = perm_json[0] if len(perm_json) > 0 else {
            "list_users": False,
            "edit_users": False,
            "edit_parents": False,
            "list_parents": False,
            "list_children": False,
            "edit_report_cards": False,
            "list_own_children": True,
            "edit_children": False,
            "check_in": False,
            "view_stats": False
    }
    # Create the currently logged in user object
    user_json = {
        "username": user.username,
        "id": user.id,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "groups": group_ids,
        "is_active": user.is_active,
        "permissions": perm_validated
    }
    return Response({'authenticated': user_json})

@permission_classes([UsersActions])
class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    Requires the user to be a member of a group with UserActions set to True => {'detail': 'You do not have permissions to perform this action'}
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer

@permission_classes([UsersActions])
class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    Requires the user to be a member of a group with UserActions set to True => {'detail': 'You do not have permissions to perform this action'}
    """
    queryset = Group.objects.all().order_by('name')
    serializer_class = GroupSerializer

@permission_classes([IsAuthenticated])
class PermissionViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows a list of permission to be viewed or edited.
    """
    queryset = Permission.objects.all()
    serializer_class = PermissionSerializer

    def filter_queryset(self, queryset):
        request = self.request
        group = request.query_params.get('group')
        if group:
            queryset = queryset.filter(group=group)
            return queryset

        return queryset
    
@permission_classes([UsersActions | ParentsActions])
class ParentViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited. Filters by active parameter.
    Requires the user to be a member of a group with UserActions or ParentsActions set to True => {'detail': 'You do not have permissions to perform this action'}
    """
    queryset = User.objects.all().order_by('last_name')
    permissions = Permission.objects.filter(list_own_children=True).values_list('group', flat=True)
    queryset = queryset.filter(groups__in = permissions)
    serializer_class = UserSerializer

    def filter_queryset(self, queryset):
        request = self.request
        active = request.query_params.get('active')
        if active:
            active = True if active == "true" else False
            queryset = queryset.filter(is_active=active)
            return queryset

        return queryset

@permission_classes([UsersActions])
class StaffViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows staff users to be viewed or edited. Filter by active parameter.
    Requires the user to be a member of a group with UserActions set to True => {'detail': 'You do not have permissions to perform this action'}
    """
    queryset = User.objects.all().order_by('last_name')
    permissions = Permission.objects.filter(list_own_children=False).values_list('group', flat=True)
    queryset = queryset.filter(groups__in = permissions)
    serializer_class = UserSerializer

    def filter_queryset(self, queryset):
        request = self.request
        active = request.query_params.get('active')
        if active:
            active = True if active == "true" else False
            queryset = queryset.filter(is_active=active)
            return queryset

        return queryset