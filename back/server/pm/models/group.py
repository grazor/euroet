from ordered_model.models import OrderedModel

from django.db import models

from server.pm.models.product import Product
from server.pm.models.component import Component


class Group(OrderedModel):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    name = models.CharField(max_length=1023, null=True, blank=True)

    order_with_respect_to = ('product',)

    class Meta:
        ordering = ('product',)

