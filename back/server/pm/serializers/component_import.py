from rest_framework import serializers

from server.pm.models import ComponentImport
from server.users.serializers import UserSerializer


class ComponentImportSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True, source='created_by')
    created_by = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = ComponentImport
        read_only_fields = [
            'uuid',
            'status',
            'original_name',
            'created_at',
            'author',
            'complete',
            'rows',
            'processed',
            'errors',
        ]
        fields = read_only_fields + ['created_by']


class ComponentImportRequestSerializer(serializers.Serializer):
    data = serializers.FileField()
