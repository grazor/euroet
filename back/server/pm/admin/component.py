from django.contrib import admin

from server.pm.models import Component


@admin.register(Component)
class ComponentAdmin(admin.ModelAdmin):
    search_fields = ('code', 'name')
    autocomplete_fields = ('manufacturer', 'collection')
    list_display = ('code', 'name', 'price', 'manufacturer', 'collection')
    list_select_related = ('manufacturer', 'collection')
    list_filter = ('manufacturer', 'collection')

    readonly_fields = ('code',)
    fields = ('code', 'name', 'description', 'price', 'manufacturer', 'collection')

