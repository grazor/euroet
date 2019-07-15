from django.db import models
from django.contrib.auth import get_user_model

from server.pm.models.collection import Collection
from server.pm.models.manufacturer import Manufacturer
from server.pm.models.component_base import ComponentBase

User = get_user_model()


class Component(ComponentBase):
    code = models.CharField(max_length=63, db_index=True, null=True, blank=True, unique=True)

    collection = models.ForeignKey(Collection, blank=True, null=True, on_delete=models.SET_NULL)
    manufacturer = models.ForeignKey(Manufacturer, blank=True, null=True, on_delete=models.SET_NULL)

    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    def str(self) -> str:
        return f'{self.code}'
