from rest_framework import viewsets, permissions
from django.db.models import Max

from server.pm.models import Project
from server.pm.permissions import CanUpdateProject
from server.pm.serializers import ProjectSerializer


class ProjectViewset(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = (permissions.IsAuthenticated, CanUpdateProject)
    lookup_field = 'slug'
    pagination_class = None

    def get_queryset(self):
        user = self.request.user
        qs = Project.objects.active().prefetch_related('access', 'access__user')
        if not user.is_superuser:
            qs = qs.filter(access__user=user)

        if self.action == 'list':
            qs = qs.annotate(last_update_at=Max('products__updated_at')).order_by('-last_update_at')

        return qs
