from decimal import Decimal

from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator

User = get_user_model()


class Component(models.Model):
    code = models.CharField(max_length=32, db_index=True, null=True, blank=True, unique=True)
    description = models.CharField(max_length=256, null=True, blank=True)

    created_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL)
    merged_to = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL)

    price = models.DecimalField(
        max_digits=12, decimal_places=3, default=Decimal(0), validators=(MinValueValidator(Decimal(0)),)
    )
    collection = models.ForeignKey('Collection', blank=True, null=True, on_delete=models.SET_NULL)

    def __str__(self) -> str:
        return f'{self.code} ({self.description})'
