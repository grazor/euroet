from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action

from server.pm.models import Component
from server.pm.permissions import HasComponentsAccess
from server.pm.serializers import ComponentSerializer
from server.pm.logic.component import find_components


class ComponentViewset(viewsets.ModelViewSet):
    serializer_class = ComponentSerializer
    permission_classes = (permissions.IsAuthenticated, HasComponentsAccess)
    queryset = Component.objects.all().prefetch_related('collection', 'manufacturer')

    def list(self, request):  # noqa: A003
        page_size = self.pagination_class.page_size
        code = request.query_params.get('q', None)
        if code and len(code) > 2:
            components = find_components(code, page_size)
            serializer = ComponentSerializer(components, many=True)
            data = {'count': len(components), 'next': None, 'previous': None, 'results': serializer.data}
            return Response(data)
        return super().list(request)

    @action(detail=False, methods=['post'], name='Import components')
    def import_file(self, request, *args, **kwargs):
        if not request.files:
            raise
