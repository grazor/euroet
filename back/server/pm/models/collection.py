from decimal import Decimal

from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
from django.utils.translation import gettext as _


class Collection(models.Model):
    name = models.CharField(max_length=255, null=True, blank=True)
    description = models.TextField(max_length=4095, null=True, blank=True)

    discount = models.DecimalField(
        _('default discount'),
        max_digits=5,
        decimal_places=2,
        default=Decimal(0),
        validators=(MinValueValidator(Decimal(-100.0)), MaxValueValidator(Decimal(100.0))),
    )

    def __str__(self) -> str:
        return f'{self.name}'

