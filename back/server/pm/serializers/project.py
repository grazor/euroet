from rest_framework import serializers

from server.pm.models import Project
from server.users.serializers import UserSerializer
from server.pm.serializers.project_access import ProjectAccessSerializer


class ProjectSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    access = ProjectAccessSerializer(read_only=True, many=True)
    created_by = serializers.HiddenField(default=serializers.CurrentUserDefault())
    last_update_at = serializers.DateTimeField(read_only=True, required=False)

    is_starred = serializers.SerializerMethodField()

    def get_is_starred(self, obj):
        user = self.context['request'].user
        user_access = obj.get_user_access(user)
        return user_access.is_starred if user_access else False

    class Meta:
        model = Project

        fields = (
            'slug',
            'name',
            'description',
            'frozen_at',
            'created_by',
            'created_at',
            'owner',
            'access',
            'is_starred',
            'last_update_at',
            'modified_at',
        )
