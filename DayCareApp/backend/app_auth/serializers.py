from django.contrib.auth.models import Group, User
from rest_framework import serializers
from .models import Permission

class UserSerializer(serializers.ModelSerializer):
    '''Serializer to convert the Django user model instance to JSON.
    The fields selected are what fields are included from the user model.
    Hyperlinked - returns a full URL to get the user, instead of constructing one on the frontend'''
    class Meta:
        model = User
        fields = ['url', 'id', 'username', 'first_name', 'last_name', 'email', 'is_active', 'groups']

class UserRegistrationSerializer(serializers.ModelSerializer):
    '''Serializer for user registration'''
    password = serializers.CharField(write_only=True)

    class Meta:
        model=User
        fields = ['username', 'first_name', 'last_name', 'email', 'groups', 'password']

    def create(self, validated_data):
        """
        Expects { username, first_name, last_name, email, password, group=[group_id,...] }
        => user instance
        """
        
        try:
            #Creates a User instance
            user = User(
                username=validated_data['username'],
                first_name=validated_data['first_name'],
                last_name=validated_data['last_name'],
                email=validated_data['email']
            )
            #Sets a password for the user instance. Django automatically hashes the password before storing
            user.set_password(validated_data['password'])
            #Adds groups to the user
            user.save()
            for group_id in validated_data['groups']:
                user.groups.add(group_id)
            user.save()

            return user
        except:
            return {'created': False}

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    username = serializers.CharField(required=True)

class ResetPasswordSerializer(serializers.Serializer):
    new_password = serializers.CharField(required=True)
    username = serializers.CharField(required=True)
    
class GroupSerializer(serializers.HyperlinkedModelSerializer):
    '''Serializer to convert the Django group model instance to JSON.
    The fields selected are what fields are included from the group model.
    Hyperlinked - returns a full URL to get the group, instead of constructing one on the frontend'''
    class Meta:
        model = Group
        fields = ['url', 'id', 'name']

class PermissionSerializer(serializers.ModelSerializer):
    list_users = serializers.BooleanField(),
    edit_users = serializers.BooleanField(),
    edit_parents = serializers.BooleanField(),
    list_parents = serializers.BooleanField(),
    list_children = serializers.BooleanField(),
    list_own_children = serializers.BooleanField(),
    edit_children = serializers.BooleanField(),
    check_in = serializers.BooleanField(),
    edit_report_cards = serializers.BooleanField(),
    view_stats = serializers.BooleanField()
    class Meta:
        model = Permission
        fields = ['group', 'id', 'list_users', 'edit_users', 'edit_parents', 'list_parents', 'list_children', 'edit_report_cards',
                 'list_own_children', 'edit_children', 'check_in', 'view_stats']