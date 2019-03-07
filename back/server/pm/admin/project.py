from django.contrib import admin

from server.pm.models import Project, ProjectAccess


class AccessInline(admin.TabularInline):
    raw_id_fields = ('user',)
    fields = ('user', 'access_type', 'is_active', 'is_starred')
    model = ProjectAccess
    extra = 1


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('slug', 'name', 'created_at', 'is_frozen', 'is_removed')
    list_filter = ('is_frozen', 'is_removed')
    inlines = (AccessInline,)
