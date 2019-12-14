'''
Django settings for server project.
'''

import datetime as dt
from typing import Tuple

from server.settings.components import BASE_DIR, config

SECRET_KEY = config('DJANGO_SECRET_KEY')

# Application definition:

INSTALLED_APPS: Tuple[str, ...] = (
    # et apps
    'server.users',
    'server.pm',
    'server.lib',
    # Default django apps:
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # django-admin:
    'django.contrib.admin',
    'django.contrib.admindocs',
    'admin_reorder',
    'constance',
    'constance.backends.database',
    # tasks
    'django_dramatiq',
    # rest:
    'rest_framework',
    'knox',
    # Security:
    'axes',
    # Health checks:
    # see: https://github.com/KristianOellegaard/django-health-check
    'health_check',
    'health_check.db',
    'health_check.cache',
    'health_check.storage',
)

MIDDLEWARE: Tuple[str, ...] = (
    # Content Security Policy:
    'csp.middleware.CSPMiddleware',
    # Referrer Policy:
    'django_referrer_policy.middleware.ReferrerPolicyMiddleware',
    # Django:
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    # Admin:
    'admin_reorder.middleware.ModelAdminReorder',
    # Axes
    'axes.middleware.AxesMiddleware',
)

ROOT_URLCONF = 'server.urls'

WSGI_APPLICATION = 'server.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.11/ref/settings/#databases

DATABASES = {
    'default': {
        # Choices are: postgresql_psycopg2, mysql, sqlite3, oracle
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        # Database name or filepath if using 'sqlite3':
        'NAME': config('POSTGRES_DB'),
        # You don't need these settings if using 'sqlite3':
        'USER': config('POSTGRES_USER'),
        'PASSWORD': config('POSTGRES_PASSWORD'),
        'HOST': config('DJANGO_DATABASE_HOST'),
        'PORT': config('DJANGO_DATABASE_PORT', cast=int),
        'CONN_MAX_AGE': config('CONN_MAX_AGE', cast=int, default=60),
    }
}

# Cache

CACHES = {
    'default': {
        'BACKEND': 'redis_cache.RedisCache',
        'LOCATION': 'redis://{host}:{port}'.format(host=config('REDIS_HOST'), port=config('REDIS_PORT')),
    }
}


# Internationalization
# https://docs.djangoproject.com/en/1.11/topics/i18n/

LANGUAGE_CODE = 'en-us'

USE_I18N = True
USE_L10N = True

LANGUAGES = (('en', 'English'), ('ru', 'Russian'))

LOCALE_PATHS = ('locale/',)

USE_TZ = True
TIME_ZONE = 'UTC'


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.11/howto/static-files/

STATIC_URL = '/static/'

STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
)

STATICFILES_DIRS = (BASE_DIR.joinpath('server', 'static'),)

# Templates
# https://docs.djangoproject.com/en/1.11/ref/templates/api

TEMPLATES = [
    {
        'APP_DIRS': True,
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR.joinpath('server', 'templates')],
        'OPTIONS': {
            'context_processors': [
                'django.contrib.auth.context_processors.auth',
                'django.template.context_processors.debug',
                'django.template.context_processors.i18n',
                'django.template.context_processors.media',
                'django.contrib.messages.context_processors.messages',
                'django.template.context_processors.request',
            ]
        },
    }
]

# Media files
# Media-root is commonly changed in production
# (see development.py and production.py).

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR.joinpath('media')


# Django Rest Framework
REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
    'DEFAULT_AUTHENTICATION_CLASSES': ('knox.auth.TokenAuthentication',),
    'DEFAULT_PERMISSION_CLASSES': ('rest_framework.permissions.IsAuthenticated',),
    'DATETIME_FORMAT': '%s',
}

# Django authentication system
# https://docs.djangoproject.com/en/1.11/topics/auth/

AUTH_USER_MODEL = 'users.User'

AUTHENTICATION_BACKENDS = ('django.contrib.auth.backends.ModelBackend', 'axes.backends.AxesBackend')

PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.BCryptSHA256PasswordHasher',
    'django.contrib.auth.hashers.BCryptPasswordHasher',
    'django.contrib.auth.hashers.PBKDF2PasswordHasher',
    'django.contrib.auth.hashers.PBKDF2SHA1PasswordHasher',
    'django.contrib.auth.hashers.Argon2PasswordHasher',
]


# Security
# https://docs.djangoproject.com/en/1.11/topics/security/

REST_KNOX = {'TOKEN_TTL': dt.timedelta(days=14), 'AUTO_REFRESH': True}

SESSION_COOKIE_HTTPONLY = True
CSRF_COOKIE_HTTPONLY = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_BROWSER_XSS_FILTER = True

X_FRAME_OPTIONS = 'DENY'

# https://django-referrer-policy.readthedocs.io/
REFERRER_POLICY = 'no-referrer'

# Admin reorder
ADMIN_REORDER = (
    {'app': 'constance', 'models': ('constance.Config',), 'label': 'Euroet'},
    {'app': 'users', 'models': ('users.User', 'auth.Group', 'knox.AuthToken', 'axes.AccessAttempt', 'axes.AccessLog')},
    {'app': 'pm', 'label': 'Project Management'},
)
