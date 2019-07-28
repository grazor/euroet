from typing import TypeVar, Optional
from decimal import Decimal

from ordered_model.models import OrderedModel

from django.db import models
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.core.validators import MaxValueValidator, MinValueValidator
from django.utils.translation import gettext as _

from server.pm.models.group import Group
from server.pm.models.component import Component
from server.pm.models.component_base import ComponentBase

T = TypeVar('T', bound='Entry')


class Entry(ComponentBase, OrderedModel):
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='entries')
    prototype = models.ForeignKey(Component, null=True, blank=True, on_delete=models.SET_NULL)

    qty = models.IntegerField(_('Quantity'), validators=(MinValueValidator(1),), default=1)

    custom_name = models.CharField(max_length=255, null=True, blank=True)
    custom_price = models.DecimalField(
        max_digits=12, decimal_places=3, default=Decimal(0), validators=(MinValueValidator(Decimal(0)),)
    )

    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    order_with_respect_to = ('group',)

    class Meta:
        ordering = ('group', 'order')

    def __str__(self) -> str:
        return f'{self.group_id} <- {self.code} (#{self.qty})'

    @property
    def name(self) -> str:
        return self.prototype.name if self.prototype else self.custom_name

    @property
    def price(self) -> Decimal:
        return self.prototype.price if self.prototype else self.custom_price

    @property
    def code(self) -> str:
        return self.prototype.code if self.prototype else ''

    @property
    def description(self) -> str:
        return self.prototype.description if self.prototype else ''

    @property
    def manufacturer_name(self) -> str:
        return self.prototype.manufacturer.name if self.prototype and self.prototype.manufacturer else ''

    @property
    def collection_name(self) -> str:
        return self.prototype.collection.name if self.prototype and self.prototype.collection else ''

    @property
    def collection_discount(self) -> Decimal:
        return self.prototype.collection.discount if self.prototype and self.prototype.collection else ''

    @classmethod
    def add_component_from_prototype(cls: T, group: Group, component: Component, qty: int = 1) -> T:
        return cls.objects.create(group=group, prototype=component, qty=qty)

    @classmethod
    def create_component(cls: T, group: Group, name: str, price: Optional[Decimal] = None, qty: int = 1) -> T:
        return cls.objects.create(
            group=group, prototype=None, qty=qty, custom_name=name, custom_price=price or Decimal(0)
        )

    @property
    def discount_price_of_one(self) -> Decimal:
        discount = (self.collection_discount or Decimal(0.0)) / Decimal(100.0)
        return self.price * (Decimal(1) - discount)

    @property
    def total_price(self) -> Decimal:
        return self.discount_price_of_one * Decimal(self.qty)

    def extract_component(self) -> None:
        raise NotImplementedError()
