from rest_framework import serializers

from server.pm.models import Component, Collection, Manufacturer


class CollectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Collection
        fields = ('name', 'description', 'discount')


class ManufacturerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Manufacturer
        fields = ('name', 'description')


class ComponentSerializer(serializers.ModelSerializer):
    manufacturer = ManufacturerSerializer(read_only=True)
    collection = CollectionSerializer(read_only=True)
    total_price = serializers.DecimalField(read_only=True, max_digits=12, decimal_places=3)
    match_code = serializers.BooleanField(read_only=True, default=False)

    class Meta:
        model = Component
        fields = (
            'id',
            'code',
            'name',
            'description',
            'price',
            'manufacturer',
            'collection',
            'total_price',
            'match_code',
        )
