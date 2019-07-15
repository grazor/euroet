from typing import TypeVar
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
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    prototype = models.ForeignKey(Component, null=True, blank=True, on_delete=models.SET_NULL)

    qty = models.IntegerField(_('Quantity'), validators=(MinValueValidator(1),), default=1)

    code = models.CharField(max_length=63, null=True, blank=True)
    manufacturer_name = models.CharField(max_length=255, null=True, blank=True)
    collection_name = models.CharField(max_length=255, null=True, blank=True)
    collection_discount = models.DecimalField(
        _('default discount'),
        max_digits=5,
        decimal_places=2,
        default=Decimal(0),
        validators=(MinValueValidator(Decimal(-100.0)), MaxValueValidator(Decimal(100.0))),
    )

    created_at = models.DateTimeField(auto_now_add=True)
    synced_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    order_with_respect_to = ('group',)

    class Meta:
        ordering = ('group',)

    def __str__(self) -> str:
        return f'{self.group_id} <- {self.code} (#{self.qty})'

    @classmethod
    def add_component_from_prototype(cls: T, group: Group, component: Component, qty: int = 1) -> T:
        return cls.objects.create(
            group=group,
            prototype=component,
            qty=qty,
            code=component.code,
            name=component.name,
            description=component.description,
            price=component.price,
            manufacturer_name=component.manufacturer and component.manufacturer.name,
            collection_name=component.collection and component.collection.name,
            collection_discount=component.collection and component.collection.discount or Decimal(0),
        )

    @property
    def total_price(self) -> Decimal:
        discount = (self.collection_discount or Decimal(0.0)) / Decimal(100.0)
        return self.price * (Decimal(1) - discount) * Decimal(self.qty)

    @property
    def is_consistent(self) -> bool:
        return self.prototype and self.synced_at >= self.prototype.modified_at or True

    def make_consistent(self) -> None:
        if not self.prototype:
            return

        self.code = self.prototype.code
        self.name = self.prototype.name
        self.description = self.prototype.description
        self.price = self.prototype.price
        self.manufacturer_name = self.prototype.manufacturer and self.prototype.manufacturer.name
        self.collection_name = self.prototype.collection and self.prototype.collection.name
        self.collection_discount = self.prototype.collection and self.prototype.collection.discount or Decimal(0)
        self.synced_at = timezone.now()
        self.save(
            update_fields=[
                'code',
                'name',
                'description',
                'price',
                'manufacturer_name',
                'collection_name',
                'collection_discount',
                'synced_at',
            ]
        )

    def extract_component(self) -> None:
        raise NotImplementedError()
