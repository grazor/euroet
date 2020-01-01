from rest_framework.permissions import SAFE_METHODS, BasePermission

from server.pm.models import Project, ProjectPermission
from server.users.models import User


def can_access_project(user: User, project: Project, read_only: bool) -> bool:
    """Checks whether user can edit project, assuming access table is prefetched."""
    if user.has_perm(f'pm.{ProjectPermission.can_edit_all_projects.name}'):
        return True

    if read_only and user.has_perm(f'pm.{ProjectPermission.can_view_all_projects.name}'):
        return True

    access = next(filter(lambda x: x.user == user, project.access.all()), None)
    return read_only or access.allows_write if access else False


class CanAccessProject(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        return any(
            [
                user.has_perm(f'pm.{ProjectPermission.can_create_projects.name}'),
                user.has_perm(f'pm.{ProjectPermission.can_manage_projects.name}'),
                user.has_perm(f'pm.{ProjectPermission.can_view_all_projects.name}'),
                user.has_perm(f'pm.{ProjectPermission.can_edit_all_projects.name}'),
            ]
        )

    def has_object_permission(self, request, view, obj):
        read_only = request.method in SAFE_METHODS
        return can_access_project(request.user, obj, read_only)


class HasProjectDetailAccess(BasePermission):
    def has_permission(self, request, view):
        read_only = request.method in SAFE_METHODS
        return can_access_project(request.user, request.project, read_only)


class HasComponentsAccess(BasePermission):
    def has_permission(self, request, view):
        read_only = request.method in SAFE_METHODS
        return read_only or request.user.has_perm('pm.can_manage_components')
