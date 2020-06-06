from rest_framework import viewsets, permissions
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.decorators import action

from server.pm.models import Entry, Group, Product, Project
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
        __import__('pdb').set_trace()
        original_product = self.get_object()
        product = self.get_object()

        serializer = ProductCopySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        target_project = get_object_or_404(Project, slug=serializer.validated_data['target_project_slug'])
        product.id = None
        product.project = target_project
        product.slug = serializer.validated_data['copy_slug']
        product.save()

        groups = []
        for group in original_product.group_set.all():
            group.id = None
            group.product = product
            group.save()
            groups.append(group)

        for original_group, group in groups.items():
            entries = []
            for entry in original_group.entries:
                entry.id = None
                entry.group = group
                entries.append(entry)
            Entry.objects.bulk_insert(entries)

        return Response()

    def get_queryset(self):
        project = self.request.project
        return (
            Product.objects.filter(project_id=project.id)
            .select_related('created_by', 'project')
            .prefetch_related('project__access', 'project__access__user')
        )
