from django.contrib import admin

from server.pm.models import Product, Project, ProjectAccess
from server.lib.deactivate_model_mixin import ActiveListFilter, DeactivateAdminMixin


class AccessInline(admin.TabularInline):
    model = ProjectAccess
    raw_id_fields = ('user',)
    fields = ('user', 'access_type', 'is_starred')
    classes = ('collapse',)
    extra = 1


class ProductInline(admin.TabularInline):
    model = Product
    fields = readonly_fields = ('slug', 'name')
    classes = ('collapse',)
    show_change_link = True
    extra = 0

    def has_add_permission(self, request):
        return False


@admin.register(Project)
class ProjectAdmin(DeactivateAdminMixin, admin.ModelAdmin):
    list_display = ('slug', 'name', 'created_by', 'created_at', 'modified_at', 'is_active')
    list_select_related = ('created_by',)
    list_filter = (ActiveListFilter, 'created_by')

    inlines = (AccessInline, ProductInline)

