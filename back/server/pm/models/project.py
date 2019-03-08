import logging
from typing import Optional

from django.db import models
from django.dispatch import receiver
from django.db.models.signals import post_save

from server.users.models import User
from server.pm.models.project_access import ProjectAccess

logger = logging.getLogger('pm')


class Project(models.Model):
    slug = models.SlugField(primary_key=True)
    name = models.CharField(max_length=128)
    description = models.TextField(max_length=2048, null=True, blank=True)

    users = models.ManyToManyField(User, through='ProjectAccess', through_fields=('project', 'user'))

    is_frozen = models.BooleanField(default=False)
    is_removed = models.BooleanField(default=False)

    created_by = models.ForeignKey(
        User, related_name='created_projects', blank=True, null=True, on_delete=models.SET_NULL
    )
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def owner(self) -> Optional[User]:
        owner = None
        try:
            owner = ProjectAccess.objects.get(project=self, access_type=ProjectAccess.AccessType.own.name)
        except ProjectAccess.DoesNotExist:
            logger.error(f'Project {self.slug} has no owner')
        return owner.user

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
