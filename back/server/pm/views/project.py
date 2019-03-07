from typing import Any, Dict

from rest_framework import viewsets, permissions

from server.pm.models import Project
from server.pm.serializers import ProjectSerializer


class ProjectViewset(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = (permissions.IsAuthenticated,)
    pagination_class = None

    def get_queryset(self):
        user = self.request.user
        filters: Dict[str, Any] = {}
        if not user.is_superuser:
            filters = {'projectaccess__user': user, 'projectaccess__is_active': True}
        return Project.objects.filter(**filters)
