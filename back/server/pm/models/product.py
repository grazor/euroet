from uuid import uuid4

from django.db import models
from django.utils import timezone
from django.contrib.auth import get_user_model

from server.lib.deactivate_model_mixin import DeactivateMixin

User = get_user_model()


class Product(DeactivateMixin, models.Model):
    slug = models.SlugField(db_index=True)
    name = models.CharField(max_length=128)
    description = models.TextField(max_length=2048, null=True, blank=True)

    project = models.ForeignKey('Project', null=True, blank=True, related_name='products', on_delete=models.CASCADE)
    components = models.ManyToManyField('Component', through='ProductComponent')

    updated_by = models.ForeignKey(User, null=True, on_delete=models.SET_NULL, related_name='updated')
    updated_at = models.DateTimeField(auto_now=True)

    created_by = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)
    created_at = models.DateTimeField(auto_now=True)

    class Meta:
        # Making possible to use same slug within multiple projects
        # Therefore keeping auto id field as primary key
        unique_together = ('project', 'slug')

    def delete(self, *args, **kwargs):
        self.deleted_at = timezone.now()
        self.slug = str(uuid4())
        self.project = None
        self.save(update_fields=['deleted_at', 'slug', 'project'])

    def __str__(self) -> str:
        return f'{self.project_id}/{self.slug} ({self.name})'
