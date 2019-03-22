from django.contrib import admin

from server.pm.models import Product, Project, ProjectAccess
from server.lib.deactivate_model_mixin import ActiveListFilter


class AccessInline(admin.TabularInline):
    model = ProjectAccess
    raw_id_fields = ('user',)
    fields = ('user', 'access_type', 'is_starred')
    classes = ('collapse',)
    extra = 1


class ProductInline(admin.TabularInline):
    model = Product
    fields = ('slug', 'name')
    classes = ('collapse',)
    show_change_link = True
    extra = 0


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('slug', 'name', 'created_at', 'frozen_at', 'deleted_at')
    list_filter = (ActiveListFilter,)
    inlines = (AccessInline, ProductInline)
