from typing import Optional

from django.db import models
from django.dispatch import receiver
from django.db.models.signals import post_save

from server.users.models import User
from server.pm.models.project_access import ProjectAccess
from server.lib.deactivate_model_mixin import DeactivateMixin


class Project(DeactivateMixin, models.Model):
    slug = models.SlugField(db_index=True, unique=True)
    name = models.CharField(max_length=128)
    description = models.TextField(max_length=2048, null=True, blank=True)

    users = models.ManyToManyField(User, through='ProjectAccess', through_fields=('project', 'user'))

    frozen_at = models.DateTimeField(default=None, null=True, blank=True)

    created_by = models.ForeignKey(
        User, related_name='created_projects', blank=True, null=True, on_delete=models.SET_NULL
    )
    modified_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def owner(self) -> Optional[User]:
        """Returns project owner assuming access is prefetched threrore avoids filtering access qs."""
        owner = next(filter(lambda x: x.access_type == ProjectAccess.AccessType.own.name, self.access.all()), None)
        return owner and owner.user

    def __str__(self) -> str:
        return f'{self.slug} ({self.name})'


@receiver(post_save, sender=Project)
def create_owner(sender, instance, created, **kwargs):
    if not instance.created_by:
        return

    if created:
        ProjectAccess.objects.create(
            project=instance, user=instance.created_by, access_type=ProjectAccess.AccessType.own.name
        )
