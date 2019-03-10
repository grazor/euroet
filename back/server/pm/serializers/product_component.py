from rest_framework import serializers

from server.pm.models import Component, ProductComponent
from server.pm.serializers.component import ComponentSerializer


class CurrentProductDefault:
    def set_context(self, serializer_field):
        self.product = serializer_field.context['request'].product

    def __call__(self):
        return self.product


class ProductComponentSerializer(serializers.ModelSerializer):
    product = serializers.HiddenField(default=CurrentProductDefault())
    component = ComponentSerializer(read_only=True)
    aggregated_price = serializers.DecimalField(read_only=True, max_digits=12, decimal_places=3)

    class Meta:
        model = ProductComponent
        fields = ('product', 'component', 'qty', 'aggregated_price')


class ProductComponentAddSerializer(serializers.ModelSerializer):
    product = serializers.HiddenField(default=CurrentProductDefault())
    component = serializers.PrimaryKeyRelatedField(read_only=False, queryset=Component.objects.all())

    class Meta:
        model = ProductComponent
        fields = ('product', 'component', 'qty')
