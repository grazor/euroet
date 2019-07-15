from django.contrib import admin

from server.pm.models import Entry, Group


class EntryInline(admin.TabularInline):
    raw_id_fields = ('prototype',)
    fields = ('prototype', 'code', 'name', 'price', 'discount', 'qty')
    model = Entry
    extra = 1


@admin.register(Group)
class GrouprAdmin(admin.ModelAdmin):
    list_display = ('product', 'name')
    list_select_related = ('product',)
    list_filter = ('product',)

    inlines = (EntryInline,)

