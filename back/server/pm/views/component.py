from rest_framework import views, viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action

from server.pm.models import Component
from server.pm.permissions import HasComponentsAccess
from server.pm.serializers import ComponentSerializer
from server.pm.logic.component import find_components


class ComponentViewset(viewsets.ModelViewSet):
    serializer_class = ComponentSerializer
    permission_classes = (permissions.IsAuthenticated, HasComponentsAccess)
    queryset = Component.objects.all()

    def list(self, request):  # noqa: A003
        code = request.query_params.get('q', None)
        components = find_components(code)
        serializer = ComponentSerializer(components, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'], name='Import components')
    def import_file(self, request, *args, **kwargs):
        __import__('pdb').set_trace()
        if not request.files:
            raise
