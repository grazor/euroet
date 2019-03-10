from rest_framework import serializers

from server.pm.models import Product
from server.users.serializers import UserSerializer


class CurrentProjectDefault:
    def set_context(self, serializer_field):
        self.project = serializer_field.context['request'].project

    def __call__(self):
        return self.project


class ProductSerializer(serializers.ModelSerializer):
    created_by = serializers.HiddenField(default=serializers.CurrentUserDefault())
    updated_by = UserSerializer(read_only=True)
    project = serializers.HiddenField(default=CurrentProjectDefault())

    class Meta:
        model = Product
        fields = ('slug', 'name', 'description', 'project', 'created_by', 'created_at', 'updated_at', 'updated_by')
