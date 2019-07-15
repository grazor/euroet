from django.contrib import admin

from server.pm.models import Group, Product
from server.lib.deactivate_model_mixin import ActiveListFilter, DeactivateAdminMixin


class GroupInline(admin.TabularInline):
    model = Group
    fields = ('name',)
    classes = ('collapse',)
    show_change_link = True
    extra = 0


@admin.register(Product)
class ProductAdmin(DeactivateAdminMixin, admin.ModelAdmin):
    list_display = ('slug', 'name', 'project', 'created_by', 'created_at', 'modified_at', 'is_active')
    list_select_related = ('project', 'created_by')
    list_filter = (ActiveListFilter, 'project')

    inlines = (GroupInline,)

