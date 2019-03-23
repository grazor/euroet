from rest_framework.permissions import SAFE_METHODS, BasePermission

from server.pm.models import Product, ProjectAccess
from server.users.models import User


def can_access_product(user: User, product: Product, read_only: bool) -> bool:
    """Checks whether user can edit project, assuming access table is prefetched."""
    if user.role == User.Roles.admin.name:
        return True

    access = next(filter(lambda x: x.user == user, product.access.all()), None)
    return (
        access
        and (
            read_only
            or access.access_type in [ProjectAccess.AccessType.own.name, ProjectAccess.AccessType.write.name]
        )
        or False
    )


class CanAccessProject(BasePermission):
    def has_object_permission(self, request, view, obj):
        read_only = request.method in SAFE_METHODS
        return can_access_product(request.user, obj, read_only)


class HasProjectDetailAccess(BasePermission):
    def has_permission(self, request, view):
        read_only = request.method in SAFE_METHODS
        return can_access_product(request.user, request.project, read_only)


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == User.Roles.admin.name


class IsWriteableForAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.method in SAFE_METHODS or request.user.role == User.Roles.admin.name
