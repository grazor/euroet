from drf_yasg.utils import swagger_auto_schema

from django.conf import settings
from rest_framework import mixins, parsers, response, viewsets, exceptions, permissions

from server.pm.tasks import import_components_task
from server.pm.models import ComponentImport
from server.pm.permissions import HasComponentsAccess
from server.pm.serializers import ComponentImportSerializer, ComponentImportRequestSerializer


class ComponentImportViewset(
    mixins.ListModelMixin, mixins.RetrieveModelMixin, mixins.CreateModelMixin, viewsets.GenericViewSet
):
    serializer_class = ComponentImportSerializer
    permission_classes = (permissions.IsAuthenticated, HasComponentsAccess)
    parser_classes = (parsers.MultiPartParser, parsers.FormParser)

    def get_queryset(self):
        if self.request.user.is_superuser:
            return ComponentImport.objects.all()
        return ComponentImport.objects.filter(created_by=self.request.user)

    @swagger_auto_schema(request_body=ComponentImportRequestSerializer)
    def create(self, request, *args, **kwargs):
        serializer = ComponentImportRequestSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data['data']

        import_data = ComponentImport.objects.create()
        *_, file_type = data.name.split('.')
        if file_type not in {'csv', 'xlsx'}:
            raise exceptions.ParseError(detail='Unsupported file extension')

        filename = f'{import_data.uuid}.{file_type}'
        filepath = settings.MEDIA_ROOT.joinpath('imports', filename)

        with open(filepath, 'wb+') as dest:
            for chunk in data.chunks():
                dest.write(chunk)

        import_data.import_file = f'imports/{filename}'
        import_data.status = ComponentImport.ImportStatus.QUEUED.value
        import_data.save(update_fields=['import_file', 'status'])

        import_components_task.send(str(import_data.uuid))

        return response.Response(ComponentImportSerializer(import_data).data)
