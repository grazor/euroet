from django.contrib import admin

from server.pm.models import Report


@admin.register(Report)
class ComponentAdmin(admin.ModelAdmin):
    list_display = ('uuid', 'report_type', 'project', 'product')
    list_filter = ('report_type', 'project', 'product')
    list_select_related = ('project', 'product')

    def has_add_permission(self, request, obj=None):
        return False
