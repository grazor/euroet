# -*- coding: utf-8 -*-

# Logging
# https://docs.djangoproject.com/en/1.11/topics/logging/

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': (
                '%(asctime)s [%(process)d] [%(levelname)s] '
                'pathname=%(pathname)s lineno=%(lineno)s '
                'funcname=%(funcName)s %(message)s'
            ),
            'datefmt': '%Y-%m-%d %H:%M:%S',
        },
        'simple': {'format': '%(asctime)s [%(levelname)s] %(message)s', 'datefmt': '%Y-%m-%d %H:%M:%S'},
    },
    'handlers': {
        'console': {'level': 'DEBUG', 'class': 'logging.StreamHandler', 'formatter': 'simple'},
        'console-verbose': {'level': 'DEBUG', 'class': 'logging.StreamHandler', 'formatter': 'verbose'},
        'error-file': {
            'level': 'ERROR',
            'class': 'logging.handlers.RotatingFileHandler',
            'maxBytes': 1024 * 1024 * 100,  # 10MB
            'backupCount': 10,
            'filename': '/var/log/share/django.error',
            'formatter': 'simple',
        },
    },
    'loggers': {
        'django': {'handlers': ['console', 'error-file'], 'propagate': True, 'level': 'INFO'},
        'security': {'handlers': ['console-verbose'], 'level': 'ERROR', 'propagate': False},
        'server': {'handlers': ['console', 'error-file'], 'propagate': True, 'level': 'INFO'},
    },
}
