from uuid import uuid4

from django.db import models
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator

from server.lib.deactivate_model_mixin import DeactivateMixin

User = get_user_model()


class Product(DeactivateMixin, models.Model):
    slug = models.SlugField(db_index=True)
    name = models.CharField(max_length=255)
    description = models.TextField(max_length=4095, null=True, blank=True)
    qty = models.IntegerField(default=1, validators=[MinValueValidator(1)])

    project = models.ForeignKey('Project', null=True, blank=True, related_name='products', on_delete=models.CASCADE)

    created_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    class Meta:
        # Making possible to use same slug within multiple projects
        unique_together = ('project', 'slug')

    def delete(self, *args, **kwargs):
        self.deleted_at = timezone.now()
        self.slug = str(uuid4())
        self.project = None
        self.save(update_fields=['deleted_at', 'slug', 'project'])

    def __str__(self) -> str:
        return f'{self.slug} ({self.name})'

    @property
    def project_name(self):
        return self.project and self.project.name or 'Draft'
