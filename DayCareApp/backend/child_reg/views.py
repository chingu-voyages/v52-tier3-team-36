from django.shortcuts import render
from rest_framework import permissions, viewsets
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .serializers import ChildSerializer
from app_auth.permissions import IsParent, IsAdministrator, IsStaff
from .models import Child, Checkin

@permission_classes([IsAuthenticated])
class ChildViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    Requires the user to be in the Administrators group => {'detail': 'You do not have permissions to perform this action'}
    """
    queryset = Child.objects.all().order_by('last_name')
    serializer_class = ChildSerializer

    def filter_queryset(self, queryset):
        required_groups = ['Parents']
        if any(group.name in required_groups for group in self.request.user.groups.all()):
            queryset = queryset.filter(parent=self.request.user)
            return queryset
        else:
            return queryset
