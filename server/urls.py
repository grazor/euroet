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
from django.contrib import admin
from django.conf.urls import url, include
from django.views.generic import TemplateView
from django.contrib.admindocs import urls as admindocs_urls

admin.autodiscover()


urlpatterns = [
    # Apps:
    # Health checks:
    url(r'^health/', include(health_urls)),  # noqa: DJ05

    # django-admin:
    url(r'^admin/doc/', include(admindocs_urls)),  # noqa: DJ05
    url(r'^admin/', admin.site.urls),

    # Text and xml static files:
    url(r'^robots\.txt$', TemplateView.as_view(
        template_name='txt/robots.txt',
        content_type='text/plain',
    )),
    url(r'^humans\.txt$', TemplateView.as_view(
        template_name='txt/humans.txt',
        content_type='text/plain',
    )),
]

if settings.DEBUG:  # pragma: no cover
    import debug_toolbar  # noqa: Z435
    from django.views.static import serve  # noqa: Z435

    urlpatterns = [
        # URLs specific only to django-debug-toolbar:
        url(r'^__debug__/', include(debug_toolbar.urls)),  # noqa: DJ05

        # Serving media files in development only:
        url(r'^media/(?P<path>.*)$', serve, {
            'document_root': settings.MEDIA_ROOT,
        }),
    ] + urlpatterns
