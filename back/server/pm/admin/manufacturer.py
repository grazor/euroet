from django.contrib import admin

from server.pm.models import Manufacturer


@admin.register(Manufacturer)
class ManufacturerAdmin(admin.ModelAdmin):
    search_fields = ('name',)
    list_display = ('name', 'description')

