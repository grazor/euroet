from decimal import Decimal

from django.db import models
from django.core.validators import MinValueValidator


class ComponentBase(models.Model):
    name = models.CharField(max_length=255, null=True, blank=True)

    price = models.DecimalField(
        max_digits=12, decimal_places=3, default=Decimal(0), validators=(MinValueValidator(Decimal(0)),)
    )

    class Meta:
        abstract = True

    def str(self) -> str:
        return f'{self.code}'
