from django.contrib import admin
from django.utils.safestring import mark_safe

from server.pm.models import ComponentImport


@admin.register(ComponentImport)
class ComponentImportAdmin(admin.ModelAdmin):
    readonly_fields = ('uuid', 'complete', 'created_at', 'created_by', 'rows', 'processed', 'download', 'errors')
    list_display = ('uuid', 'complete', 'created_at', 'created_by', 'rows', 'processed')
    list_filter = ('created_by',)
    list_select_related = ('created_by',)

    def download(self, component_import):
        return mark_safe(f'<a href="{component_import.download_url}">download</a>')  # noqa: S703, S308

    download.short_description = 'Download url'
    download.allow_tags = True

    def has_add_permission(self, request, obj=None):
        return False
