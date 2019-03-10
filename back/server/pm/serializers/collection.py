from rest_framework import serializers

from server.pm.models import Collection


class CollectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Collection
        fields = ('slug', 'name', 'discount')
