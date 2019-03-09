from django.contrib import admin

from server.pm.models import Product, Project, ProjectAccess


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
    list_display = ('slug', 'name', 'created_at', 'is_frozen', 'is_removed')
    list_filter = ('is_frozen', 'is_removed')
    inlines = (AccessInline, ProductInline)
