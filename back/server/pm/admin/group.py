from django.contrib import admin

from server.pm.models import Group


@admin.register(Group)
class GroupAdmin(admin.ModelAdmin):
    list_display = ('product', 'name')
    list_filter = ('product',)
    list_select_related = ('product',)
