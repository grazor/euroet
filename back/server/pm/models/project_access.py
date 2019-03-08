from enum import Enum

from django.db import models
from django.contrib.auth import get_user_model
from django.utils.translation import gettext as _

from server.lib.enum import as_choices

User = get_user_model()


class ProjectAccess(models.Model):
    class AccessType(Enum):
        own = _('Owner')
        read = _('Read access')
        write = _('Edit access')

    project = models.ForeignKey('Project', on_delete=models.CASCADE, related_name='access')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    access_type = models.CharField(max_length=16, choices=as_choices(AccessType))
    is_starred = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    created_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='granted')
    created_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'project')

    def __str__(self) -> str:
        return f'{self.project_id} <- {self.user_id} ({self.access_type})'
