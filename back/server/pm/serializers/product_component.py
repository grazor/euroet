from rest_framework import serializers

from server.pm.models import ProductComponent
from server.pm.serializers.component import ComponentSerializer


class CurrentProductDefault:
    def set_context(self, serializer_field):
        self.product = serializer_field.context['request'].product

    def __call__(self):
        return self.product


class ProductComponentSerializer(serializers.ModelSerializer):
    product = serializers.HiddenField(default=CurrentProductDefault())
    component = ComponentSerializer()
    aggregated_price = serializers.DecimalField(max_digits=12, decimal_places=3)

    class Meta:
        model = ProductComponent
        fields = ('product', 'component', 'qty', 'aggregated_price')
