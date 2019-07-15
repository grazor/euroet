from rest_framework import mixins, generics, viewsets, permissions
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError

from server.pm.models import Entry, Group, Product, Component
from server.pm.permissions import HasProjectDetailAccess
from server.pm.serializers import EntrySerializer, MoveEntrySerializer, GroupEntrySerializer, ComponentCopySerializer


class EntryViewset(mixins.ListModelMixin, viewsets.GenericViewSet):
    serializer_class = GroupEntrySerializer
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
        qs = Group.objects.filter(product_id=product.id).prefetch_related('entries', 'entries__prototype')
        return qs

    @action(detail=False, methods=['post'], name='Add component from prototype')
    def copy(self, request, *args, **kwargs):
        product = request.product
        serializer = ComponentCopySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        component = get_object_or_404(Component, id=serializer.data['component'])
        group, _ = Group.objects.get_or_create(product=product, name=serializer.data['group'])
        entry = Entry.add_component_from_prototype(group=group, component=component, qty=serializer.data['qty'])

        return Response(EntrySerializer(entry).data)

    @action(detail=False, methods=['put'], name='Move entry up')
    def up(self, request, *args, **kwargs):
        serializer = MoveEntrySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        entry = get_object_or_404(Entry, id=serializer.data['entry'])
        entry.up()
        return Response(MoveEntrySerializer({'entry': entry.id, 'order': entry.order}).data)

    @action(detail=False, methods=['put'], name='Move entry down')
    def down(self, request, *args, **kwargs):
        serializer = MoveEntrySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        entry = get_object_or_404(Entry, id=serializer.data['entry'])
        entry.down()
        return Response(MoveEntrySerializer({'entry': entry.id, 'order': entry.order}).data)
