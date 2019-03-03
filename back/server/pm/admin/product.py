from django.contrib import admin

from server.pm.models import Product, ProductComponent


class ComponentInline(admin.TabularInline):
    raw_id_fields = ('component',)
    fields = ('component', 'qty')
    model = ProductComponent
    extra = 1


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'project', 'created_at', 'created_by')
    list_filter = ('project',)
    readonly_fields = ('created_at', 'created_by', 'updated_at', 'updated_by')
    list_select_related = ('project', 'created_by')

    inlines = (ComponentInline,)
