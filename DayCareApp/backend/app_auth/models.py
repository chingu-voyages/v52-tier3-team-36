from django.db import models
from django.contrib.auth.models import Group

class Permission(models.Model):
    '''Model for custom permissions. Each operation on the app is based on the group membership.
    The group needs to have the permission allowed. True/False'''
    group = models.OneToOneField(Group, on_delete=models.CASCADE, unique=True)
    list_users = models.BooleanField(default=False)
    edit_users = models.BooleanField(default=False)
    list_parents = models.BooleanField(default=False)
    edit_parents = models.BooleanField(default=False)
    list_children = models.BooleanField(default=False)
    list_own_children = models.BooleanField(default=False)
    edit_children = models.BooleanField(default=False)
    check_in = models.BooleanField(default=False)
    edit_report_cards = models.BooleanField(default=False)
    view_stats = models.BooleanField(default=False)
