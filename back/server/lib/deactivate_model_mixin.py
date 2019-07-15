from enum import Enum
from uuid import uuid4

from django.db import models
from django.utils import timezone
from django.contrib import admin
from django.utils.translation import gettext as _

from server.lib.enum import as_choices


class DeactivateQuerySet(models.query.QuerySet):
    def delete(self) -> None:
        self.deactivate()

    def deactivate(self) -> None:
        self.update(deleted_at=timezone.now(), slug=str(uuid4()))

    def active(self) -> models.query.QuerySet:
        return self.filter(deleted_at=None)


class DeactivateManager(models.Manager):
    def get_query_set(self) -> DeactivateQuerySet:
        return DeactivateQuerySet(self.model, using=self._db)

    def active(self) -> DeactivateQuerySet:
        return self.get_query_set().active()


class DeactivateMixin(models.Model):
    deleted_at = models.DateTimeField(default=None, editable=False, null=True, db_index=True)
    objects = DeactivateManager()

    def delete(self, *args, **kwargs):
        pass

    class Meta:
        abstract = True


class ActiveListFilter(admin.SimpleListFilter):
    class ActiveStatus(Enum):
        active = _('Active')
        deleted = _('Deleted')

    title = _('is deleted')

    # Parameter for the filter that will be used in the URL query.
    parameter_name = 'active'

    def lookups(self, request, model_admin):
        return as_choices(ActiveListFilter.ActiveStatus)

    def queryset(self, request, queryset):
        if self.value() == ActiveListFilter.ActiveStatus.active.name:
            return queryset.filter(deleted_at__isnull=True)
        if self.value() == ActiveListFilter.ActiveStatus.deleted.name:
            return queryset.filter(deleted_at__isnull=False)
        return queryset


class DeactivateAdminMixin(admin.ModelAdmin):
    def is_active(self, instance):
        return instance.deleted_at is None

    is_active.boolean = True
