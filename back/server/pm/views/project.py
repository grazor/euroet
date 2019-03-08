from rest_framework import viewsets, permissions

from server.pm.models import Project
from server.pm.serializers import ProjectSerializer


class ProjectViewset(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = (permissions.IsAuthenticated,)
    pagination_class = None

    def get_queryset(self):
        user = self.request.user
        qs = Project.objects.all().prefetch_related('access', 'access__user')
        if not user.is_superuser:
            qs = qs.filter(access__user=user)
        return qs
