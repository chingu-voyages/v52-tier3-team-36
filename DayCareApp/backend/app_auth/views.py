from django.contrib.auth.models import Group, User
from rest_framework import permissions, viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializer, GroupSerializer, UserRegistrationSerializer, ChangePasswordSerializer, ResetPasswordSerializer
from .permissions import IsParent, IsAdministrator, IsStaff
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
@permission_classes([IsAuthenticated, IsAdministrator])
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
    groups: [group.id,...]}'''
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
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
@permission_classes([IsAuthenticated, IsAdministrator])
def reset_password(request):
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
    user = request.user
    group_ids = [group.id for group in user.groups.all()]
    user_json = {
        "username": user.username,
        "groups": group_ids
    }
    return Response({'authenticated': user_json})

@permission_classes([IsAuthenticated, IsAdministrator])
class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    Requires the user to be in the Administrators group => {'detail': 'You do not have permissions to perform this action'}
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer

@permission_classes([IsAuthenticated, IsAdministrator])
class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    Requires the user to be in the Administrators group => {'detail': 'You do not have permissions to perform this action'}
    """
    queryset = Group.objects.all().order_by('name')
    serializer_class = GroupSerializer