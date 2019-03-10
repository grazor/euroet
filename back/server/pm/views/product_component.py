from rest_framework import viewsets, permissions
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from django.utils.translation import gettext as _
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError

from server.pm.models import Product, ProductComponent
from server.pm.permissions import HasProjectDetailAccess
from server.pm.serializers import ComponentSerializer, ProductComponentSerializer, ProductComponentAddSerializer
from server.pm.logic.component import find_components


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

    def create(self, request, *args, **kwargs):
        serializer = ProductComponentAddSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        component = serializer.validated_data['component']
        qty = serializer.validated_data['qty']
        pc, created = ProductComponent.objects.get_or_create(
            product=request.product, component=component, defaults={'qty': qty}
        )
        if not created:
            raise ValidationError(detail={'code': _('This component already exists')})
        return Response(ProductComponentSerializer(pc).data)

    @action(detail=False, methods=['get'])
    def find(self, request, *args, **kwargs):
        code = request.query_params.get('q', None)
        used_components = list(
            ProductComponent.objects.filter(product=request.product).values_list('component_id', flat=True)
        )
        components = find_components(code, exclude=used_components)
        serializer = ComponentSerializer(components, many=True)
        return Response(serializer.data)
