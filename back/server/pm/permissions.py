from rest_framework.permissions import SAFE_METHODS, BasePermission

from server.pm.models import ProjectAccess
from server.users.models import User


class CanUpdateProject(BasePermission):
    def has_object_permission(self, request, view, obj):
        """Checks whether user can edit project, assuming access table is prefetched."""
        if request.method in SAFE_METHODS:
            return True

        user = request.user
        if user.role == User.Roles.admin.name:
            return True

        access = next(filter(lambda x: x.user == user, obj.access.all()), None)
        return (
            access
            and access.access_type in [ProjectAccess.AccessType.own.name, ProjectAccess.AccessType.write.name]
            or False
        )
