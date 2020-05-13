from django.contrib import admin

from server.pm.models import Entry, Group


class EntryInline(admin.TabularInline):
    raw_id_fields = ('prototype',)
    readonly_fields = ('code', 'name', 'price', 'collection_discount')
    fields = ('prototype', 'qty') + readonly_fields
    autocomplete_fields = ('prototype',)
    model = Entry
    extra = 1


@admin.register(Group)
class GrouprAdmin(admin.ModelAdmin):
    search_fields = ('name',)
    autocomplete_fields = ('product',)
    list_display = ('name', 'product')
    list_select_related = ('product',)
    list_filter = ('product',)

    inlines = (EntryInline,)
