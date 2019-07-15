from uuid import uuid4
from typing import Optional

from django.db import models
from django.utils import timezone
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.utils.translation import gettext as _

from server.pm.models.project_access import ProjectAccess
from server.lib.deactivate_model_mixin import DeactivateMixin

User = get_user_model()


class Project(DeactivateMixin, models.Model):
    slug = models.SlugField(max_length=255, db_index=True, unique=True)
    name = models.CharField(max_length=255)
    description = models.TextField(max_length=4095, null=True, blank=True)

    created_by = models.ForeignKey(
        User, null=True, blank=True, related_name='created_projects', on_delete=models.SET_NULL
    )
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    permissions = (
        ('can_create_projects', _('Can create projects')),
        ('can_manage_projects', _('Can manage projects')),
        ('can_view_all_projects', _('Can view all projects')),
        ('can_edit_all_projects', _('Can edit all projects')),
    )

    def delete(self, *args, **kwargs):
        self.deleted_at = timezone.now()
        self.slug = str(uuid4())
        self.save(update_fields=['deleted_at', 'slug'])

    @property
    def owner(self) -> Optional[User]:
        """Returns project owner assuming access is prefetched threfore avoids filtering access qs."""
        owner = next(filter(lambda x: x.access_type == ProjectAccess.AccessType.own.name, self.access.all()), None)
        return owner and owner.user

    def is_starred_by_user(self, user: User) -> bool:
        """Checks if user added project to favorites."""
        access = get_user_access(user)
        return access.is_starred if access else False

    def toggle_user_star(self, user: User) -> bool:
        """Toggles user's star. Assumes user has permission to access this project."""
        access = get_user_access(user, create=True)
        access.is_starred ^= True
        access.save(update_fields=['is_starred'])
        return access.is_starred

    def get_user_access(self, user: User, create=False) -> Optional[ProjectAccess]:
        """Returns user's project access."""
        access = next(filter(lambda x: x.user == user, self.access.all()), None)
        if not access and create:
            access = ProjectAccess.objects.create(
                project=self, user=user, access_type=ProjectAccess.AccessType.read.name, created_by=user
            )
        return access

    def __str__(self) -> str:
        return f'{self.slug} ({self.name})'


@receiver(post_save, sender=Project)
def create_owner(sender, instance, created, **kwargs):
    if not instance.created_by:
        return

    if created:
        ProjectAccess.objects.create(
            project=instance,
            user=instance.created_by,
            access_type=ProjectAccess.AccessType.own.name,
            created_by=instance.created_by,
        )
