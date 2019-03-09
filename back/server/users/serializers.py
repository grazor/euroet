from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework.authtoken.serializers import AuthTokenSerializer

User = get_user_model()


class UserTokenSerializer(AuthTokenSerializer):
    pass


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User

        fields = ('id', 'username', 'role', 'first_name', 'last_name', 'initials', 'photo', 'initials', 'color')
        read_only_fields = ('id', 'initials', 'color')
