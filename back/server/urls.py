# -*- coding: utf-8 -*-

"""
Main URL mapping configuration file.

Include other URLConfs from external apps using method `include()`.

It is also a good practice to keep a single URL to the root index page.

This examples uses Django's default media
files serving technique in development.
"""

from health_check import urls as health_urls

from django.conf import settings
from django.urls import path, include
from django.contrib import admin
from django.views.generic import TemplateView
from django.contrib.admindocs import urls as admindocs_urls

from server.pm import urls as pm_urls
from server.users import urls as users_urls

admin.autodiscover()

urlpatterns = [
    # Apps:
    path('api/users/', include(users_urls)),
    path('api/pm/', include(pm_urls)),

    # Health checks:
    path('health/', include(health_urls)),  # noqa: DJ05

    # django-admin:
    path('admin/doc/', include(admindocs_urls)),  # noqa: DJ05
    path('admin/', admin.site.urls),

    # Text and xml static files:
    path('robots.txt', TemplateView.as_view(
        template_name='txt/robots.txt',
        content_type='text/plain',
    )),
    path('humans.txt', TemplateView.as_view(
        template_name='txt/humans.txt',
        content_type='text/plain',
    )),
]

if settings.DEBUG:  # pragma: no cover
    import debug_toolbar  # noqa: Z435
    from django.views.static import serve  # noqa: Z435
    from rest_framework.documentation import include_docs_urls

    urlpatterns = [
        # URLs specific only to django-debug-toolbar:
        path('__debug__/', include(debug_toolbar.urls)),

        # Serving media files in development only:
        path('media/(<path:path>)', serve, {'document_root': settings.MEDIA_ROOT}),

        # Drf doc
        path(
            'docs/', include_docs_urls(
                title='Euroet API',
                authentication_classes=[],
                permission_classes=[],
        ))
] + urlpatterns
