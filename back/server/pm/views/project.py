from rest_framework import viewsets, exceptions, permissions
from django.db.models import Max
from django.utils.translation import gettext as _

from server.pm.models import Product, Project
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
