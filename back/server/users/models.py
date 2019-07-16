from enum import Enum

from colorhash import ColorHash

from django.db import models
from django.conf import settings
from django.utils.translation import gettext as _
from django.contrib.auth.models import AbstractUser

from server.lib.enum import as_choices


class User(AbstractUser):
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

    # Fields
    email = models.EmailField(_('Email address'), unique=True)  # unique not blank
    photo = models.FilePathField(
        max_length=255, null=True, blank=True, path=settings.MEDIA_ROOT.joinpath('photo').as_posix()
    )

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
        return f'{name}'
