from decimal import Decimal

from ordered_model.models import OrderedModel

from django.db import models

from server.pm.models.product import Product
from server.pm.models.component import Component


class Group(OrderedModel):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    name = models.CharField(max_length=1023, null=True, blank=True, db_index=True)

    order_with_respect_to = ('product',)

    class Meta:
        ordering = ('product', 'order')
        unique_together = ('product', 'name')

    @property
    def total_price(self):
        entries = (self._prefetched_objects_cache or {}).get('entries') or []
        return sum(entry.total_price for entry in entries) or Decimal(0)
