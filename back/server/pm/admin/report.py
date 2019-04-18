from django.contrib import admin
from django.utils.safestring import mark_safe

from server.pm.models import Report


@admin.register(Report)
class ComponentAdmin(admin.ModelAdmin):
    readonly_fields = ('uuid', 'download', 'report_type', 'project', 'product', 'created_at', 'created_by')
    exclude = ('filename',)
    list_display = ('uuid', 'report_type', 'project', 'product', 'created_at')
    list_filter = ('report_type', 'project', 'product')
    list_select_related = ('project', 'product')

    def download(self, report):
        return mark_safe(f'<a href="/media/{report.filename}">view</a>')

    download.short_description = 'Download url'
    download.allow_tags = True

    def has_add_permission(self, request, obj=None):
        return False
