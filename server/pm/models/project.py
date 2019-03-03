from django.db import models
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from django.db.models.signals import post_save

User = get_user_model()


class Project(models.Model):
    name = models.CharField(max_length=128)
    description = models.TextField(max_length=2048, null=True, blank=True)

    users = models.ManyToManyField(User, through='ProjectAccess', through_fields=('project', 'user'))

    is_frozen = models.BooleanField(default=False)
    is_removed = models.BooleanField(default=False)

    created_by = models.ForeignKey(
        User, related_name='created_projects', blank=True, null=True, on_delete=models.SET_NULL
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f'{self.name}'


@receiver(post_save, sender=Project)
def create_owner(sender, instance, created, **kwargs):
    from server.pm.models import ProjectAccess

    if not instance.created_by:
        return

    ProjectAccess.objects.create(
        project=instance, user=instance.created_by, access_type=ProjectAccess.ACCESS_TYPE_OWN
    )
