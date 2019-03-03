from decimal import Decimal

from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
from django.utils.translation import gettext as _


class Collection(models.Model):
    slug = models.CharField(max_length=16, primary_key=True)
    name = models.CharField(max_length=128, null=True, blank=True)
    desctiption = models.TextField(max_length=2048, null=True, blank=True)

    discount = models.DecimalField(
        _('default discount'),
        max_digits=5,
        decimal_places=2,
        default=Decimal(0),
        validators=(MinValueValidator(Decimal(-100.0)), MaxValueValidator(Decimal(100.0))),
    )

    def __str__(self) -> str:
        return f'{self.slug} ({self.name})'
