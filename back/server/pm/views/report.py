from rest_framework import mixins, viewsets, permissions
from django.shortcuts import get_object_or_404
from rest_framework.response import Response

from server.pm.models import Report, Project
from server.pm.permissions import HasProjectDetailAccess
from server.pm.serializers import ReportSerializer
from server.pm.logic.report import report_product, report_project
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


class ProjectReportViewset(mixins.ListModelMixin, mixins.CreateModelMixin, viewsets.GenericViewSet):
    serializer_class = ReportSerializer
    permission_classes = (permissions.IsAuthenticated, HasProjectDetailAccess)
    pagination_class = None

    def initialize_request(self, request, *args, **kwargs):
        request = super().initialize_request(request, *args, **kwargs)
        project_slug = self.kwargs.get('project_slug')
        self.request.project = get_object_or_404(Project.objects.active(), slug=project_slug)
        return request

    def get_queryset(self):
        project = self.request.project
        qs = Report.objects.filter(project_id=project.id, complete=True).order_by('-created_at')
        return qs

    def create(self, request, *args, **kwargs):
        report = report_project(request.project, author=request.user)
        return Response(ReportSerializer(report).data)
