from wsgiref.util import FileWrapper

from django.http import HttpResponse
from rest_framework import mixins, status, generics, viewsets, permissions
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError

from server.pm.models import Report, Product
from server.pm.permissions import HasProjectDetailAccess
from server.pm.serializers import ReportSerializer
from server.pm.logic.report import report_product
from server.pm.views.product_detail_mixin import ProductDetailMixin


class ProductReportViewset(
    ProductDetailMixin, mixins.ListModelMixin, mixins.CreateModelMixin, viewsets.GenericViewSet
):
    serializer_class = ReportSerializer
    permission_classes = (permissions.IsAuthenticated, HasProjectDetailAccess)
    pagination_class = None

    def get_queryset(self):
        product = self.request.product
        qs = Report.objects.filter(product_id=product.id, complete=True).order_by('-created_at')
        return qs

    def create(self, request, *args, **kwargs):
        report = report_product(request.product, author=request.user)
        return Response(ReportSerializer(report).data)
