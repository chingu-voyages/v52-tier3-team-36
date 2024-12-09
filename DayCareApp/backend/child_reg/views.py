from datetime import datetime
from django.utils import timezone
from django.utils.dateparse import parse_date
from rest_framework import viewsets
from rest_framework.decorators import permission_classes
from app_auth.permissions import ChildrenActions, CheckinActions
from app_auth.models import Permission
from .serializers import ChildSerializer, CheckinSerializer, CheckinGETSerializer
from .models import Child, Checkin

@permission_classes([ChildrenActions])
class ChildViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows children to be viewed or edited.
    Requires the user to be a member of a group with ChildrenActions set to True => {'detail': 'You do not have permissions to perform this action'}
    """
    queryset = Child.objects.all().order_by('last_name')
    serializer_class = ChildSerializer

    def filter_queryset(self, queryset):
        user_groups = self.request.user.groups.all()
        user_permissions = Permission.objects.filter(group__in=user_groups)
        required_permissions = {'list_own_children': True}
        if user_permissions.filter(**required_permissions):
            queryset = queryset.filter(parent=self.request.user)
            return queryset
        else:
            return queryset

@permission_classes([CheckinActions])
class CheckinViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows for check in/out and report card operations to be viewed or edited.
    Can be filtered by date - accepts from/to parameters.
    Default is from the beginning of the month until the current date if no params are passed.
    Requires the user to be a member of a group with CheckinActions set to True => {'detail': 'You do not have permissions to perform this action'}
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

@permission_classes([CheckinActions])
class CurrentlyCheckedViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows currently checked in children to be viewed or edited.
    Requires the user to be a member of a group with CheckinActions set to True => {'detail': 'You do not have permissions to perform this action'}
    """
    checkins = Checkin.objects.filter(checkout__isnull=True).values_list('child', flat=True)
    queryset = Child.objects.filter(id__in = checkins)
    serializer_class = ChildSerializer