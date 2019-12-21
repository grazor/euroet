from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework.authtoken.serializers import AuthTokenSerializer

User = get_user_model()


class UserTokenSerializer(AuthTokenSerializer):
    pass


class UserSerializer(serializers.ModelSerializer):
    can_edit_components = serializers.SerializerMethodField()

    def get_can_edit_components(self, obj):
        return obj.has_perm('pm.change_component')

    class Meta:
        model = User

        fields = ('id', 'username', 'first_name', 'last_name', 'initials', 'photo', 'color', 'can_edit_components')
        read_only_fields = ('id', 'initials', 'color')
