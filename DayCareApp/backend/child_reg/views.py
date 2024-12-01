from django.shortcuts import render
from datetime import datetime
from django.utils import timezone
from django.utils.timezone import make_aware
from django.utils.dateparse import parse_date
from rest_framework import permissions, viewsets
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .serializers import ChildSerializer, CheckinSerializer
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

@permission_classes([IsAuthenticated])
class CheckinViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    Requires the user to be in the Administrators group => {'detail': 'You do not have permissions to perform this action'}
    """
    queryset = Checkin.objects.all().order_by('-checkin')
    serializer_class = CheckinSerializer

    def filter_queryset(self, queryset):
        request = self.request
        child = request.query_params.get('child')
        from_date = request.query_params.get('from')
        now = timezone.now()
        to_date = request.query_params.get('to')
        
        if child:
            queryset = queryset.filter(child=child)

        if from_date:
            parse_from = parse_date(from_date)
            from_date_object = datetime(parse_from.year, parse_from.month, parse_from.day)
            aware_from = timezone.make_aware(from_date_object)
            if to_date:
                parse_to = parse_date(to_date)
                to_date_object = datetime(parse_to.year, parse_to.month, parse_to.day)
                aware_to = timezone.make_aware(to_date_object)
                queryset = queryset.filter(checkin__range=(aware_from, aware_to))
            else:
                queryset = queryset.filter(checkin__range=(aware_from, now))


        return queryset