from rest_framework import serializers

from server.pm.models import Product
from server.users.serializers import UserSerializer


class CurrentProjectDefault:
    def set_context(self, serializer_field):
        self.project = serializer_field.context['request'].project

    def __call__(self):
        return self.project


class ProductSerializer(serializers.ModelSerializer):
    project = serializers.HiddenField(default=CurrentProjectDefault())
    author = UserSerializer(read_only=True, source='created_by')
    editor = UserSerializer(read_only=True, source='updated_by')

    created_by = serializers.HiddenField(default=serializers.CurrentUserDefault())
    updated_by = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Product
        fields = (
            'slug',
            'name',
            'description',
            'project',
            'created_by',
            'author',
            'updated_at',
            'editor',
            'created_by',
            'updated_by',
        )
