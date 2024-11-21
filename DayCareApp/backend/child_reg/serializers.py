from rest_framework import serializers
from .models import Child, Checkin

class ChildSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Child
        fields = ['url', 'id', 'first_name', 'last_name', 'notes', 'dob', 
                  'parent', 'gender', 'address', 'em_contact_name', 'em_contact_number', 'upload' ]