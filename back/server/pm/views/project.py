from rest_framework import status, viewsets, exceptions, permissions
from django.db.models import Max
from rest_framework.response import Response
from django.utils.translation import gettext as _
from rest_framework.decorators import action

from server.pm.models import Product, Project, ProjectAccess
from server.users.models import User
from server.pm.permissions import CanAccessProject
from server.pm.serializers import ProjectSerializer


class ProjectViewset(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = (permissions.IsAuthenticated, CanAccessProject)
    lookup_field = 'slug'
    pagination_class = None

    def get_queryset(self):
        user = self.request.user
        qs = Project.objects.active().prefetch_related('access', 'access__user')
        if not user.is_superuser:
            qs = qs.filter(access__user=user)

        if self.action == 'list':
            qs = qs.annotate(last_update_at=Max('products__updated_at')).order_by('-last_update_at')

        return qs

    def perform_destroy(self, instance):
        user = self.request.user
        has_products = Product.objects.filter(project=instance).exists()
        if user.role != User.Roles.admin.name and has_products:
            raise exceptions.NotAcceptable(_('Can not delete project with products'))

        instance.delete()

    @action(detail=True, methods=['get'], name='Star project')
    def star(self, request, slug=None):
        user = request.user
        if user.role == User.Roles.admin.name:
            project = self.get_object()
            access, created = ProjectAccess.objects.get_or_create(
                project=project,
                user=user,
                defaults={'access_type': ProjectAccess.AccessType.write.name, 'is_starred': True},
            )
            if not created:
                access.is_starred = True
                access.save(update_fields=['is_starred'])
        else:
            ProjectAccess.objects.filter(project__slug=slug, user=user).update(is_starred=True)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['get'], name='Unstar project')
    def unstar(self, request, slug=None):
        user = request.user
        ProjectAccess.objects.filter(project__slug=slug, user=user).update(is_starred=False)
        return Response(status=status.HTTP_204_NO_CONTENT)
