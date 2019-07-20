from rest_framework import viewsets, permissions
from django.shortcuts import get_object_or_404

from server.pm.models import Product, Project
from server.pm.permissions import HasProjectDetailAccess
from server.pm.serializers import ProductSerializer


class ProductViewset(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    lookup_field = 'slug'
    permission_classes = (permissions.IsAuthenticated, HasProjectDetailAccess)
    pagination_class = None

    def initialize_request(self, request, *args, **kwargs):
        request = super().initialize_request(request, *args, **kwargs)
        project_slug = self.kwargs.get('project_slug')
        self.request.project = get_object_or_404(Project.objects.active(), slug=project_slug)
        return request

    def get_queryset(self):
        project = self.request.project
        return (
            Product.objects.filter(project_id=project.id)
            .select_related('created_by', 'project')
            .prefetch_related('project__access', 'project__access__user')
        )
