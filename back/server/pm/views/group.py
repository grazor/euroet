from rest_framework import viewsets, permissions
from django.shortcuts import get_object_or_404

from server.pm.models import Group, Product
from server.pm.permissions import HasProjectDetailAccess
from server.pm.serializers import GroupSerializer


class GroupViewset(viewsets.ModelViewSet):
    serializer_class = GroupSerializer
    permission_classes = (permissions.IsAuthenticated, HasProjectDetailAccess)
    pagination_class = None

    def initialize_request(self, request, *args, **kwargs):
        request = super().initialize_request(request, *args, **kwargs)
        project_slug = self.kwargs.get('project_slug')
        product_slug = self.kwargs.get('product_slug')
        self.request.product = get_object_or_404(
            Product.objects.filter(slug=product_slug, project__slug=project_slug)
            .select_related('project')
            .prefetch_related('project__access', 'project__access__user')
        )
        self.request.project = self.request.product.project
        return request

    def get_queryset(self):
        product = self.request.product
        qs = Group.objects.filter(product_id=product.id).prefetch_related('entries')
        return qs

