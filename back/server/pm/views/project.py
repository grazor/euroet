from rest_framework import status, viewsets, exceptions, permissions
from django.db.models import Max
from rest_framework.response import Response
from django.utils.translation import gettext as _
from rest_framework.decorators import action

from server.pm.models import Product, Project, ProjectAccess, ProjectPermission
from server.users.models import User
from server.pm.permissions import CanAccessProject
from server.pm.serializers import StarSerializer, ProjectSerializer


class ProjectViewset(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = (permissions.IsAuthenticated, CanAccessProject)
    lookup_field = 'slug'
    pagination_class = None

    def get_queryset(self):
        user = self.request.user
        qs = Project.objects.active().prefetch_related('access', 'access__user')
        if not user.has_perm(f'pm.{ProjectPermission.can_view_all_projects.name}'):
            qs = qs.filter(access__user=user)

        if self.action == 'list':
            qs = qs.annotate(product_modified_at=Max('products__modified_at')).order_by('-product_modified_at')

        return qs

    def update(self, request, *args, **kwargs):
        """DRF update method without related cache invalidation."""
        partial = kwargs.pop('partial', False)
        project = self.get_object()
        serializer = self.get_serializer(project, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def perform_destroy(self, instance):
        user = self.request.user
        has_products = Product.objects.filter(project=instance).exists()
        if not user.has_perm(f'pm.{ProjectPermission.can_remove_non_empty.name}') and has_products:
            raise exceptions.NotAcceptable(_('Can not delete project with products'))

        instance.delete()

    @action(detail=True, methods=['update'], name='Star project')
    def star(self, request, slug=None):
        user = request.user
        project = self.get_object()
        serializer = StarSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        project.set_user_star(user, serializer.data.is_starred)

        return Response(status=status.HTTP_204_NO_CONTENT)

