from rest_framework import serializers
from .models import Child, Checkin

class ChildSerializer(serializers.ModelSerializer):
    '''Serializer for the child instance. Returns a JSON with the selected fields'''
    upload = serializers.ImageField(required=False)
    class Meta:
        model = Child
        fields = ['url', 'id', 'first_name', 'last_name', 'notes', 'dob', 
                  'parent', 'gender', 'address', 'em_contact_name', 'em_contact_number', 'upload' ]
        
class CheckinSerializer(serializers.ModelSerializer):
    '''Serializer for the checkin POST/PATCH instance.'''
    class Meta:
        model = Checkin
        fields = ['url', 'id', 'child', 'checkin', 'checkout', 'checkin_staff', 
                  'checkout_staff', 'report_card', 'report_staff']
        
    def to_representation(self, instance):
        request = self.context.get('request')
        serializer = CheckinGETSerializer(instance, context={'request': request})
        return serializer.data 
        
class CheckinGETSerializer(serializers.ModelSerializer):
    '''Serializer for the GET checkin instance. Returns a JSON with the selected fields. Only returns the username of the user, instead of the ID'''
    checkin_staff = serializers.StringRelatedField()
    checkout_staff = serializers.StringRelatedField()
    report_staff = serializers.StringRelatedField()
    class Meta:
        model = Checkin
        fields = ['url', 'id', 'child', 'checkin', 'checkout', 'checkin_staff', 
                  'checkout_staff', 'report_card', 'report_staff']