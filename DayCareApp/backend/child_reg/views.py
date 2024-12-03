from datetime import datetime
from django.utils import timezone
from django.utils.dateparse import parse_date
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import permission_classes, api_view
from rest_framework.permissions import IsAuthenticated
from app_auth.permissions import IsAdministrator, IsStaff
from .serializers import ChildSerializer, CheckinSerializer, CheckinGETSerializer
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
    def get_serializer_class(self):
        if self.action == 'list' or self.action == 'retrieve':
            return CheckinGETSerializer
        return CheckinSerializer

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
                to_date_object = datetime(parse_to.year, parse_to.month, parse_to.day, hour=23, minute=59, second = 59)
                aware_to = timezone.make_aware(to_date_object)
                queryset = queryset.filter(checkin__range=(aware_from, aware_to))
            else:
                queryset = queryset.filter(checkin__range=(aware_from, now))


        return queryset

@permission_classes([IsAuthenticated, IsAdministrator or IsStaff])
class CurrentlyCheckedViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    Requires the user to be in the Administrators group => {'detail': 'You do not have permissions to perform this action'}
    """
    checkins = Checkin.objects.filter(checkout__isnull=True)
    queryset = Child.objects.filter(id__in=checkins)
    serializer_class = ChildSerializer