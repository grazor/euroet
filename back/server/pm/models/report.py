from enum import Enum
from uuid import uuid4

from django.db import models
from django.conf import settings
from django.urls import reverse
from django.contrib.auth import get_user_model
from django.utils.translation import gettext as _

from server.lib.enum import as_choices

User = get_user_model()


class Report(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    complete = models.BooleanField(default=False, db_index=True)

    project = models.ForeignKey('Project', null=True, blank=True, on_delete=models.SET_NULL)
    product = models.ForeignKey('Product', null=True, blank=True, on_delete=models.SET_NULL)

    created_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    @property
    def download_url(self):
        return f'/media/report/{self.uuid}.xlsx'

    class Meta:
        ordering = ('-created_at',)

    def __str__(self) -> str:
        return f'{self.uuid}'
