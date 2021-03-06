# -*- coding: utf-8 -*-

"""Main URL mapping configuration file."""

from health_check import urls as health_urls

from django.conf import settings
from django.urls import path, include, re_path
from django.contrib import admin
from django.views.generic import TemplateView
from django.contrib.admindocs import urls as admindocs_urls

from server.pm import urls as pm_urls
from server.users import urls as users_urls
from server.views import singlepage

admin.autodiscover()

urlpatterns = [
    # Apps:
    path('api/users/', include(users_urls)),
    path('api/', include(pm_urls)),
    # Health checks:
    path('health/', include(health_urls)),  # noqa: DJ05
    # django-admin:
    path('admin/doc/', include(admindocs_urls)),  # noqa: DJ05
    path('admin/', admin.site.urls),
    # Text and xml static files:
    path('robots.txt', TemplateView.as_view(template_name='txt/robots.txt', content_type='text/plain')),
    path('humans.txt', TemplateView.as_view(template_name='txt/humans.txt', content_type='text/plain')),
]

if settings.DEBUG:  # pragma: no cover
    import debug_toolbar  # noqa: Z435
    from django.conf.urls.static import static  # noqa: Z435
    from rest_framework import permissions  # noqa: Z435
    from drf_yasg import openapi  # noqa: Z435
    from drf_yasg.views import get_schema_view  # noqa: Z435

    schema_view = get_schema_view(
        openapi.Info(title='Et API', default_version='v1', description='Et API'),
        public=True,
        permission_classes=(permissions.AllowAny,),
    )

    urlpatterns = (
        static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
        + [
            # URLs specific only to django-debug-toolbar:
            path('__debug__/', include(debug_toolbar.urls)),
            # Drf doc
            path('docs/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-swagger-ui'),
        ]
        + urlpatterns
    )


urlpatterns.append(re_path(r'^(?!admin|api|docs|media|static).*$', singlepage, name='index'))
