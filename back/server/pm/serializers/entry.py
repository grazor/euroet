from rest_framework import serializers

from server.pm.models import Entry, Group, Component
from server.pm.serializers.component import ComponentSerializer


class EntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Entry
        fields = (
            'id',
            'prototype_id',
            'code',
            'name',
            'description',
            'price',
            'total_price',
            'manufacturer_name',
            'collection_name',
            'collection_discount',
            'qty',
            'synced_at',
            'is_consistent',
            'order',
        )


class GroupEntrySerializer(serializers.ModelSerializer):
    entries = EntrySerializer(many=True, read_only=True)

    class Meta:
        model = Group
        fields = ('name', 'order', 'entries')


class ComponentCopySerializer(serializers.Serializer):
    group = serializers.CharField(max_length=1023)
    component = serializers.IntegerField(min_value=1, read_only=False)
    qty = serializers.IntegerField(min_value=1)


class MoveEntrySerializer(serializers.Serializer):
    entry = serializers.IntegerField(min_value=1, read_only=False)
    order = serializers.IntegerField(min_value=0, read_only=True)
