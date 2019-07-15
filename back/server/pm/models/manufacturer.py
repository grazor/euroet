from django.db import models


class Manufacturer(models.Model):
    name = models.CharField(max_length=128, null=True, blank=True)
    description = models.TextField(max_length=2048, null=True, blank=True)

    def __str__(self) -> str:
        return f'{self.name}'
