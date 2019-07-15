# -*- coding: utf-8 -*-

"""
This file contains all the settings that defines the development server.

SECURITY WARNING: don't run with debug turned on in production!
"""

import os
import logging
from typing import Tuple

from server.settings.components import BASE_DIR
from server.settings.components.common import MIDDLEWARE, INSTALLED_APPS

# Setting the development status:

DEBUG = True


# Register dev apps

INSTALLED_APPS += ('debug_toolbar', 'nplusone.ext.django', 'webpack_loader')

# Static files:
# https://docs.djangoproject.com/en/1.11/ref/settings/#std:setting-STATICFILES_DIRS

STATICFILES_DIRS: Tuple[str, ...] = (os.path.join(BASE_DIR, '../front/build'),)

WEBPACK_LOADER = {
    'DEFAULT': {
        'BUNDLE_DIR_NAME': 'front/build',
        'STATS_FILE': os.path.join(BASE_DIR, '../front/stats.json'),
        'IGNORE': [r'.+\.hot-update.js', r'.+\.map'],
    }
}

# Django debug toolbar
# django-debug-toolbar.readthedocs.io

MIDDLEWARE += (
    'debug_toolbar.middleware.DebugToolbarMiddleware',
    # https://github.com/bradmontgomery/django-querycount
    # Prints how many queries were executed, useful for the APIs.
    'querycount.middleware.QueryCountMiddleware',
    # Prints queries
    'server.lib.sql_debug_middleware.SqlDebugMiddleware',
)


def custom_show_toolbar(request):
    """Only show the debug toolbar to users with the superuser flag."""
    return request.user.is_superuser


DEBUG_TOOLBAR_CONFIG = {'SHOW_TOOLBAR_CALLBACK': 'server.settings.environments.development.custom_show_toolbar'}

# This will make debug toolbar to work with django-csp,
# since `ddt` loads some scripts from `ajax.googleapis.com`:
CSP_SCRIPT_SRC = ("'self'", 'ajax.googleapis.com')
CSP_IMG_SRC = ("'self'", 'data:')


# nplusone
# https://github.com/jmcarp/nplusone

# Should be the first in line:
MIDDLEWARE = ('nplusone.ext.django.NPlusOneMiddleware',) + MIDDLEWARE

# Logging N+1 requests:
NPLUSONE_RAISE = False
NPLUSONE_LOGGER = logging.getLogger('django')
NPLUSONE_LOG_LEVEL = logging.WARN
