from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework.authtoken.serializers import AuthTokenSerializer

from server.pm.models import ProjectPermission

User = get_user_model()


class UserTokenSerializer(AuthTokenSerializer):
    pass


class UserSerializer(serializers.ModelSerializer):
    can_edit_components = serializers.SerializerMethodField()
    can_manage_project_reports = serializers.SerializerMethodField()

    def get_can_edit_components(self, obj):
        return obj.has_perm(f'pm.{ProjectPermission.can_change_component.name}')

    def get_can_manage_project_reports(self, obj):
        return obj.has_perm(f'pm.{ProjectPermission.can_manage_project_reports.name}')

    class Meta:
        model = User

        fields = (
            'id',
            'username',
            'first_name',
            'last_name',
            'initials',
            'photo',
            'color',
            'can_edit_components',
            'can_manage_project_reports',
        )
        read_only_fields = ('id', 'initials', 'color')
