from rest_framework import mixins, status, viewsets, permissions
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.decorators import action

from server.pm.models import Entry, Group, Component
from server.pm.permissions import HasProjectDetailAccess
from server.pm.serializers import (
    EntrySerializer,
    GroupSerializer,
    MoveEntrySerializer,
    GroupEntrySerializer,
    UpdateEntrySerializer,
    ComponentCodeSerializer,
    ComponentCopySerializer,
    ComponentCreateSerializer,
    ComponentGroupPasteSerializer,
)
from server.pm.views.product_detail_mixin import ProductDetailMixin


class EntryViewset(
    ProductDetailMixin,
    mixins.ListModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    serializer_class = GroupEntrySerializer
    permission_classes = (permissions.IsAuthenticated, HasProjectDetailAccess)
    pagination_class = None

    def get_queryset(self):
        product = self.request.product
        qs = Group.objects.filter(product_id=product.id).prefetch_related(
            'entries', 'entries__prototype', 'entries__prototype__manufacturer', 'entries__prototype__collection'
        )
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
            entry.custom_name = serializer.validated_data['name']
            update_fields.append('custom_name')
        if serializer.validated_data.get('price') is not None:
            entry.custom_price = serializer.validated_data['price']
            update_fields.append('custom_price')
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
        serializer = ComponentCopySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        component = get_object_or_404(Component, id=serializer.validated_data['component'])
        group = get_object_or_404(Group, id=serializer.validated_data['group'])
        entry = Entry.add_component_from_prototype(
            group=group, component=component, qty=serializer.validated_data['qty']
        )

        return Response(EntrySerializer(entry).data)

    @action(detail=False, methods=['post'], name='Add component from prototype by code')
    def code(self, request, *args, **kwargs):
        serializer = ComponentCodeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        queryset = Component.objects.filter(code=serializer.validated_data['code'])
        if serializer.validated_data['collection']:
            queryset = queryset.filter(collection__name=serializer.validated_data['collection'])

        try:
            component = get_object_or_404(queryset)
        except Component.MultipleObjectsReturned:
            return Response(status=status.HTTP_409_CONFLICT)
        group = get_object_or_404(Group, id=serializer.validated_data['group'])
        entry = Entry.add_component_from_prototype(
            group=group, component=component, qty=serializer.validated_data['qty']
        )

        return Response(EntrySerializer(entry).data)

    @action(detail=False, methods=['post'], name='Paste whole group with contents')
    def paste_group(self, request, *args, **kwargs):
        serializer = ComponentGroupPasteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data
        group = Group.objects.create(product=self.request.product, name=data['name'])

        entries = []
        for item in data['items']:
            queryset = Component.objects.filter(code=item['code'])
            if item['collection']:
                queryset = queryset.filter(collection__name=item['collection'])

            try:
                component = queryset.get()
            except (Component.DoesNotExist, Component.MultipleObjectsReturned):
                pass

            entries.append(Entry.add_component_from_prototype(group=group, component=component, qty=item['qty']))

        return Response({'group': GroupSerializer(group).data, 'entries': EntrySerializer(entries, many=True).data})

    @action(detail=False, methods=['post'], name='Add nonexistent component by name')
    def new(self, request, *args, **kwargs):
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
