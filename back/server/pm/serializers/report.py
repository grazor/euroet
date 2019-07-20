from rest_framework import serializers

from server.pm.models import Report
from server.users.serializers import UserSerializer


class ReportSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True, source='created_by')

    class Meta:
        model = Report
        fields = read_only_fields = ('uuid', 'created_at', 'author', 'download_url')
