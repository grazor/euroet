from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin

from server.users.forms import EtUserChangeForm

User = get_user_model()

UserAdmin.fieldsets[0][1]['fields'] += ('role',)


@admin.register(User)
class MyUserAdmin(UserAdmin):
    form = EtUserChangeForm

    radio_fields = {'role': admin.HORIZONTAL}
    list_filter = UserAdmin.list_filter + ('role',)
