from django.db import models

INCREMENT = 2_097_152


class Group(models.Model):
    product = models.ForeignKey('Product', on_delete=models.CASCADE)

    name = models.CharField(max_length=1023, null=True, blank=True)
    order = models.FloatField()

    @property
    def next_order_value(self):
        max_value = Group.objects.filter(product=self.product).aggregate(models.Max('order')).get('order__max', 0)
        return (max_value // INCREMENT + 1) * INCREMENT

    def __str__(self):
        return self.name

    class Meta:
        unique_together = ('product', 'name')
        ordering = ('-order',)

