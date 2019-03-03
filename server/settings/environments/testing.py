# -*- coding: utf-8 -*-

"""
This file contains all the settings that defines the testing environment.
"""

import logging
from typing import List

from server.settings.components.common import MIDDLEWARE

# Setting the development status:

DEBUG = False


# Static files:
# https://docs.djangoproject.com/en/1.11/ref/settings/#std:setting-STATICFILES_DIRS

STATICFILES_DIRS: List[str] = []


# nplusone
# https://github.com/jmcarp/nplusone

# Should be the first in line:
MIDDLEWARE = ('nplusone.ext.django.NPlusOneMiddleware',) + MIDDLEWARE

# Logging N+1 requests:
NPLUSONE_RAISE = True
NPLUSONE_LOGGER = logging.getLogger('django')
NPLUSONE_LOG_LEVEL = logging.WARN
