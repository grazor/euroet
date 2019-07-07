from rest_framework import serializers

from server.pm.models import Group
from server.pm.serializers.component import ComponentSerializer


class CurrentProductDefault:
    def set_context(self, serializer_field):
        self.product = serializer_field.context['request'].product

    def __call__(self):
        return self.product


class GroupSerializer(serializers.ModelSerializer):
    product = serializers.HiddenField(default=CurrentProductDefault())

    class Meta:
        model = Group
        fields = ('product', 'name', 'order')
