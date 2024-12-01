from rest_framework import serializers
from .models import Child, Checkin

class ChildSerializer(serializers.ModelSerializer):
    class Meta:
        model = Child
        fields = ['url', 'id', 'first_name', 'last_name', 'notes', 'dob', 
                  'parent', 'gender', 'address', 'em_contact_name', 'em_contact_number', 'upload' ]
        
class CheckinSerializer(serializers.ModelSerializer):
    class Meta:
        model = Checkin
        fields = ['url', 'id', 'child', 'checkin', 'checkout', 'checkin_staff', 
                  'checkout_staff', 'report_card', 'report_staff']