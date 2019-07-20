from rest_framework import viewsets, permissions
from django.shortcuts import get_object_or_404

from server.pm.models import Group, Product
from server.pm.permissions import HasProjectDetailAccess
from server.pm.serializers import GroupSerializer
from server.pm.views.product_detail_mixin import ProductDetailMixin


class GroupViewset(ProductDetailMixin, viewsets.ModelViewSet):
    serializer_class = GroupSerializer
    permission_classes = (permissions.IsAuthenticated, HasProjectDetailAccess)
    pagination_class = None

    def get_queryset(self):
        product = self.request.product
        qs = Group.objects.filter(product_id=product.id).prefetch_related('entries')
        return qs
