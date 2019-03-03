from django.contrib import admin

from server.pm.models import Component


@admin.register(Component)
class ComponentAdmin(admin.ModelAdmin):
    list_display = ('id', 'code', 'description', 'collection_id')
    list_filter = ('collection_id',)
