from rest_framework import serializers

from server.pm.models import Project
from server.users.serializers import UserSerializer


class ProjectSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)

    class Meta:
        model = Project

        fields = ('slug', 'name', 'description', 'is_frozen', 'created_at', 'owner', 'access')
