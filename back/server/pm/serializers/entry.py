from decimal import Decimal

from rest_framework import serializers

from server.pm.models import Entry, Group


class EntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Entry
        fields = (
            'id',
            'prototype_id',
            'group_id',
            'code',
            'name',
            'description',
            'price',
            'total_price',
            'manufacturer_name',
            'collection_name',
            'collection_discount',
            'qty',
            'order',
        )


class GroupEntrySerializer(serializers.ModelSerializer):
    entries = EntrySerializer(many=True, read_only=True)

    class Meta:
        model = Group
        fields = ('id', 'name', 'order', 'entries', 'total_price')


class ComponentCopySerializer(serializers.Serializer):
    group = serializers.IntegerField(min_value=1)
    component = serializers.IntegerField(min_value=1)
    qty = serializers.IntegerField(min_value=1)


class ComponentCodeSerializer(serializers.Serializer):
    group = serializers.IntegerField(min_value=1)
    code = serializers.CharField()
    collection = serializers.CharField(allow_blank=True)
    qty = serializers.IntegerField(min_value=1)


class ComponentCreateSerializer(serializers.Serializer):
    group = serializers.IntegerField(min_value=1)
    name = serializers.CharField(min_length=1)
    price = serializers.DecimalField(max_digits=12, decimal_places=2, min_value=Decimal(0), required=False)
    qty = serializers.IntegerField(min_value=1)


class MoveEntrySerializer(serializers.Serializer):
    entry = serializers.IntegerField(min_value=1, read_only=False)
    order = serializers.IntegerField(min_value=0, read_only=True)


class UpdateEntrySerializer(serializers.Serializer):
    qty = serializers.IntegerField(min_value=1)
