from rest_framework import viewsets, permissions
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from django.utils.translation import gettext as _
from rest_framework.exceptions import ValidationError

from server.pm.models import Group
from server.pm.permissions import HasProjectDetailAccess
from server.pm.serializers import GroupSerializer


class ProductGroupViewset(viewsets.ModelViewSet):
    serializer_class = GroupSerializer
    permission_classes = (permissions.IsAuthenticated, HasProjectDetailAccess)

    def initialize_request(self, request, *args, **kwargs):
        request = super().initialize_request(request, *args, **kwargs)
        project_slug = self.kwargs.get('project_slug')
        product_slug = self.kwargs.get('product_slug')
        self.request.product = get_object_or_404(
            Product.objects.filter(slug=product_slug, project__slug=project_slug).select_related('project')
        )
        self.request.project = self.request.product.project
        return request

    def get_queryset(self):
        product = self.request.product
        return Group.objects.filter(product_id=product.id)

    def perform_create(self, serializer):
        pass
