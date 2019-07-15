from rest_framework import serializers

from server.pm.models import Project
from server.users.serializers import UserSerializer
from server.pm.serializers.project_access import ProjectAccessSerializer


class ProjectSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    access = ProjectAccessSerializer(read_only=True, many=True)
    created_by = serializers.HiddenField(default=serializers.CurrentUserDefault())
    product_modified_at = serializers.DateTimeField(read_only=True, required=False)

    is_starred = serializers.SerializerMethodField()

    def get_is_starred(self, obj):
        user = self.context['request'].user
        return obj.is_starred_by_user(user)

    class Meta:
        model = Project

        fields = (
            'slug',
            'name',
            'description',
            'created_by',
            'created_at',
            'owner',
            'access',
            'is_starred',
            'product_modified_at',
            'modified_at',
        )


class StarSerializer(serializers.Serializer):
    is_starred = serializers.BooleanField(required=True)
