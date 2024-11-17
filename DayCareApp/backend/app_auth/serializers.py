from django.contrib.auth.models import Group, User
from rest_framework import serializers

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'id', 'username', 'first_name', 'last_name', 'email', 'groups']

class UserRegistrationSerializer(serializers.ModelSerializer):
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
            user = User(
                username=validated_data['username'],
                first_name=validated_data['first_name'],
                last_name=validated_data['last_name'],
                email=validated_data['email']
            )
            user.set_password(validated_data['password'])
            user.groups.set(validated_data['groups'])
            user.save()

            return user
        except:
            return {'created': False}


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']