from django.contrib import admin
from django.db.models import Q

from server.pm.models import Product, ProductComponent
from server.lib.deactivate_model_mixin import ActiveListFilter


class ComponentInline(admin.TabularInline):
    raw_id_fields = ('component',)
    fields = ('component', 'qty')
    model = ProductComponent
    extra = 1


class ActiveProjectProductListFilter(ActiveListFilter):
    def queryset(self, request, queryset):
        if self.value() == ActiveListFilter.ActiveStatus.active.name:
            return queryset.filter(
                Q(project__isnull=True) | Q(project__deleted_at__isnull=True), deleted_at__isnull=True
            )
        if self.value() == ActiveListFilter.ActiveStatus.deleted.name:
            return queryset.filter(Q(deleted_at__isnull=False) | Q(project__deleted_at__isnull=False))
        return queryset


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('slug', 'name', 'project', 'created_at', 'created_by')
    list_filter = (ActiveProjectProductListFilter, 'project')
    readonly_fields = ('created_at', 'created_by', 'updated_at', 'updated_by')
    list_select_related = ('project', 'created_by')

    inlines = (ComponentInline,)
