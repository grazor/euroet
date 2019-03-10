from rest_framework import serializers

from server.pm.models import Component
from server.pm.serializers.collection import CollectionSerializer


class ComponentSerializer(serializers.ModelSerializer):
    collection = CollectionSerializer(read_only=True)
    total_price = serializers.DecimalField(read_only=True, max_digits=12, decimal_places=3)

    class Meta:
        model = Component
        fields = ('id', 'code', 'description', 'price', 'collection', 'total_price')
        read_only_fields = ('total_price',)
