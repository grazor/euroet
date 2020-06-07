from rest_framework import viewsets, permissions
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.decorators import action

from server.pm.models import Product, Project
from server.pm.logic.copy import copy_product
from server.pm.permissions import HasProjectDetailAccess
from server.pm.serializers import ProductSerializer, ProductCopySerializer


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

    @action(detail=True, methods=['post'], name='Copy product')
    def copy(self, request, *args, **kwargs):
        product = self.get_object()

        serializer = ProductCopySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        target_project = get_object_or_404(Project, slug=serializer.validated_data['target_project_slug'])
        copy_product(
            product=product, target_project=target_project, target_slug=serializer.validated_data['copy_slug']
        )

        return Response(ProductSerializer(product).data)

    def get_queryset(self):
        project = self.request.project
        return (
            Product.objects.filter(project_id=project.id)
            .select_related('created_by', 'project')
            .prefetch_related('project__access', 'project__access__user')
        )
