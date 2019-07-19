from rest_framework import serializers

from server.pm.models import Group


class CurrentProductDefault:
    def set_context(self, serializer_field):
        self.product = serializer_field.context['request'].product

    def __call__(self):
        return self.product


class GroupSerializer(serializers.ModelSerializer):
    product = serializers.HiddenField(default=CurrentProductDefault())

    class Meta:
        model = Group
        fields = ('id', 'name', 'order', 'product', 'total_price')
        read_only_fields = ('id', 'order', 'total_price')
