from enum import Enum
from uuid import uuid4

from django.db import models
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.postgres.fields import JSONField

from server.lib.enum import as_choices

User = get_user_model()


class ComponentImport(models.Model):
    class ImportStatus(Enum):
        CREATED = 'created'
        QUEUED = 'queued'
        PROCESSING = 'processing'
        COMPLETE = 'complete'
        FAILED = 'failed'

    uuid = models.UUIDField(primary_key=True, default=uuid4, editable=False)

    original_name = models.CharField(max_length=255, null=True, blank=True)
    import_file = models.FilePathField(
        max_length=255, null=True, blank=True, path=settings.MEDIA_ROOT.joinpath('imports').as_posix()
    )

    status = models.CharField(max_length=127, choices=as_choices(ImportStatus), default=ImportStatus.CREATED.value)
    complete = models.BooleanField(default=False)
    rows = models.IntegerField(null=True, blank=True)
    processed = models.IntegerField(null=True, blank=True)
    errors = JSONField(default=list)

    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL)

    @property
    def download_url(self):
        return f'/media/imports/{self.uuid}.xlsx'

    @property
    def full_path(self):
        return settings.MEDIA_ROOT.joinpath(self.import_file)

    class Meta:
        ordering = ('-created_at',)

    def __str__(self) -> str:
        return f'{self.uuid}'
