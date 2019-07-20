from django.contrib import admin

from server.pm.models import Collection


@admin.register(Collection)
class CollectionAdmin(admin.ModelAdmin):
    search_fields = ('name',)
    list_display = ('name', 'description', 'discount')
