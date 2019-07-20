from rest_framework import mixins, status, generics, viewsets, permissions
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.exceptions import NotAcceptable, ValidationError

from server.pm.models import Entry, Group, Product, Component
from server.pm.permissions import HasProjectDetailAccess
from server.pm.serializers import (
    EntrySerializer,
    MoveEntrySerializer,
    GroupEntrySerializer,
    UpdateEntrySerializer,
    ComponentCopySerializer,
    ComponentCreateSerializer,
)


class EntryViewset(mixins.ListModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin, viewsets.GenericViewSet):
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

    def update(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        serializer = UpdateEntrySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        entry = get_object_or_404(Entry.objects.filter(id=pk, group__product=request.product))
        entry.qty = serializer.validated_data['qty']
        entry.save(update_fields=['qty'])
        return Response(EntrySerializer(entry).data)

    def partial_update(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        serializer = ComponentCreateSerializer(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        entry = get_object_or_404(
            Entry.objects.filter(id=pk, group__product=request.product, prototype_id__isnull=True)
        )
        update_fields = []
        if serializer.validated_data.get('name'):
            entry.name = serializer.validated_data['name']
            update_fields.append('name')
        if serializer.validated_data.get('price'):
            entry.price = serializer.validated_data['price']
            update_fields.append('price')
        if update_fields:
            entry.save(update_fields=update_fields)
        return Response(EntrySerializer(entry).data)

    def destroy(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        entry = get_object_or_404(Entry.objects.filter(id=pk, group__product=request.product))
        entry.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['post'], name='Add component from prototype')
    def copy(self, request, *args, **kwargs):
        product = request.product
        serializer = ComponentCopySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        component = get_object_or_404(Component, id=serializer.validated_data['component'])
        group = get_object_or_404(Group, id=serializer.validated_data['group'])
        entry = Entry.add_component_from_prototype(
            group=group, component=component, qty=serializer.validated_data['qty']
        )

        return Response(EntrySerializer(entry).data)

    @action(detail=False, methods=['post'], name='Add nonexistent component by name')
    def new(self, request, *args, **kwargs):
        product = request.product
        serializer = ComponentCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        group = get_object_or_404(Group, id=serializer.validated_data['group'])
        entry = Entry.create_component(
            group=group,
            name=serializer.validated_data['name'],
            price=serializer.validated_data.get('price'),
            qty=serializer.validated_data['qty'],
        )

        return Response(EntrySerializer(entry).data)

    @action(detail=False, methods=['put'], name='Move entry up')
    def up(self, request, *args, **kwargs):
        serializer = MoveEntrySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        entry = get_object_or_404(Entry, id=serializer.validated_data['entry'])
        entry.up()
        return Response(MoveEntrySerializer({'entry': entry.id, 'order': entry.order}).data)

    @action(detail=False, methods=['put'], name='Move entry down')
    def down(self, request, *args, **kwargs):
        serializer = MoveEntrySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        entry = get_object_or_404(Entry, id=serializer.validated_data['entry'])
        entry.down()
        return Response(MoveEntrySerializer({'entry': entry.id, 'order': entry.order}).data)
