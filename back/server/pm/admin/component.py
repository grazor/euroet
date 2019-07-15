from django.contrib import admin

from server.pm.models import Component


@admin.register(Component)
class ComponentAdmin(admin.ModelAdmin):
    list_display = ('code', 'name', 'price', 'manufacturer', 'collection')
    list_select_related = ('manufacturer', 'collection')
    list_filter = ('manufacturer', 'collection')

    readonly_fields = ('code',)

