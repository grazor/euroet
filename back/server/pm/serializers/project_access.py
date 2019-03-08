from rest_framework import serializers

from server.pm.models import ProjectAccess
from server.users.serializers import UserSerializer


class ProjectAccessSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = ProjectAccess

        fields = ('user', 'access_type', 'is_starred')
