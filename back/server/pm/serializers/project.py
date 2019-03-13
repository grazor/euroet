from rest_framework import serializers

from server.pm.models import Project
from server.users.serializers import UserSerializer
from server.pm.serializers.project_access import ProjectAccessSerializer


class ProjectSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    access = ProjectAccessSerializer(read_only=True, many=True)
    created_by = serializers.HiddenField(default=serializers.CurrentUserDefault())
    last_update_at = serializers.DateTimeField(read_only=True, required=False)

    class Meta:
        model = Project

        fields = (
            'slug',
            'name',
            'description',
            'is_frozen',
            'created_by',
            'created_at',
            'owner',
            'access',
            'last_update_at',
        )
