from rest_framework import serializers

from server.pm.models import Product
from server.users.serializers import UserSerializer


class CurrentProjectDefault:
    def set_context(self, serializer_field):
        self.project = serializer_field.context['request'].project

    def __call__(self):
        return self.project


class ProductSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True, source='created_by')

    project = serializers.HiddenField(default=CurrentProjectDefault())
    created_by = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Product
        fields = (
            'slug',
            'name',
            'description',
            'project',
            'author',
            'created_by',
            'created_at',
            'modified_at',
            'project_name',
        )

