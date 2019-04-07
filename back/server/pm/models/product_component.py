from decimal import Decimal

from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator
from django.utils.translation import gettext as _

User = get_user_model()


class ProductComponent(models.Model):
    product = models.ForeignKey('Product', related_name='elements', on_delete=models.CASCADE)
    component = models.ForeignKey('Component', on_delete=models.PROTECT)

    qty = models.IntegerField(_('Quantity'), validators=(MinValueValidator(1),), default=1)

    updated_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def aggregated_price(self) -> Decimal:
        discount = 0.0
        if self.component.collection:
            discount = self.component.collection.discount / Decimal(100.0)
        return self.component.total_price * (Decimal(1) - discount) * Decimal(self.qty)

    class Meta:
        unique_together = ('product', 'component')

    def __str__(self) -> str:
        return f'{self.product_id} <- {self.component_id} (#{self.qty})'
