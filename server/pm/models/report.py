from enum import Enum

from django.db import models
from django.contrib.auth import get_user_model
from django.utils.translation import gettext as _

from server.lib.enum import as_choices

User = get_user_model()


class Report(models.Model):
    class ReportType(Enum):
        project_full = _('Project full report')
        product = _('Product report')

    uuid = models.UUIDField(primary_key=True)
    report_type = models.CharField(max_length=16, choices=as_choices(ReportType))
    filename = models.CharField(max_length=512, null=True, blank=True)

    project = models.ForeignKey('Project', null=True, blank=True, on_delete=models.SET_NULL)
    product = models.ForeignKey('Product', null=True, blank=True, on_delete=models.SET_NULL)

    created_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f'{self.uuid}'
