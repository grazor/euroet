from enum import Enum

from colorhash import ColorHash

from django.db import models
from django.utils.translation import gettext as _
from django.contrib.auth.models import AbstractUser

from server.lib.enum import as_choices


class User(AbstractUser):
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

    class Roles(Enum):
        guest = _('Guest')
        engineer = _('Engineer')
        manager = _('Manager')
        admin = _('Admin')

    # Fields
    email = models.EmailField(_('Email address'), unique=True)  # unique not blank

    role = models.CharField(
        max_length=16, choices=as_choices(Roles), default=Roles.guest.name, db_index=True, help_text=_('Euroet role')
    )
    photo = models.FilePathField(max_length=255, null=True, blank=True)

    @property
    def initials(self) -> str:
        """Returns user's initials."""
        last = (self.last_name or ' ')[0].upper()
        first = (self.first_name or ' ')[0].upper()
        return f'{last}{first}'

    @property
    def color(self) -> str:
        """Returns tag unique color."""
        color = ColorHash(self.email)
        hue, saturation, light = color.hsl
        if light < 0.5:
            color.hsl = (hue, saturation, light + 0.4)
        return color.hex

    def __str__(self) -> str:
        if self.first_name:
            name = f'{self.last_name} {self.first_name}'
        else:
            name = f'{self.username}'
        return f'User({name})'
