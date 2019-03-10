from rest_framework import viewsets, permissions
from django.shortcuts import get_object_or_404

from server.pm.models import Product, ProductComponent
from server.pm.permissions import HasProjectDetailAccess
from server.pm.serializers import ProductComponentSerializer


class ProductComponentViewset(viewsets.ModelViewSet):
    serializer_class = ProductComponentSerializer
    permission_classes = (permissions.IsAuthenticated, HasProjectDetailAccess)
    lookup_field = 'component__code'
    lookup_url_kwarg = 'code'
    pagination_class = None

    def initialize_request(self, request, *args, **kwargs):
        request = super().initialize_request(request, *args, **kwargs)
        project_slug = self.kwargs.get('project_slug')
        product_slug = self.kwargs.get('product_slug')
        self.request.product = get_object_or_404(
            Product.objects.filter(slug=product_slug, project_id=project_slug).select_related('project')
        )
        self.request.project = self.request.product.project
        return request

    def get_queryset(self):
        product = self.request.product
        qs = ProductComponent.objects.filter(product_id=product.id).select_related(
            'component', 'component__collection'
        )
        return qs
