from rest_framework import routers

from server.pm.views.entry import EntryViewset
from server.pm.views.group import GroupViewset
from server.pm.views.report import ProductReportViewset, ProjectReportViewset
from server.pm.views.product import ProductViewset
from server.pm.views.project import ProjectViewset
from server.pm.views.component import ComponentViewset

PROJECT_URL_PREFIX = r'projects/(?P<project_slug>[\w_-]+)'
PROJECT_VIEW_PREFIX = r'{0}/products'.format(PROJECT_URL_PREFIX)
PROJECT_REPORT_VIEW_PREFIX = r'{0}/reports'.format(PROJECT_URL_PREFIX)
ENTRY_URL_PREFIX = r'{0}/(?P<product_slug>[\w_-]+)'.format(PROJECT_VIEW_PREFIX)
GROUP_VIEW_PREFIX = r'{0}/groups'.format(ENTRY_URL_PREFIX)
ENTRY_VIEW_PREFIX = r'{0}/components'.format(ENTRY_URL_PREFIX)
PRODUCT_REPORT_VIEW_PREFIX = r'{0}/reports'.format(ENTRY_URL_PREFIX)

router = routers.DefaultRouter()
router.register('components', ComponentViewset, basename='component')
router.register('projects', ProjectViewset, basename='project')
router.register(PROJECT_VIEW_PREFIX, ProductViewset, basename='product')
router.register(GROUP_VIEW_PREFIX, GroupViewset, basename='group')
router.register(ENTRY_VIEW_PREFIX, EntryViewset, basename='entry')
router.register(PRODUCT_REPORT_VIEW_PREFIX, ProductReportViewset, basename='product-report')
router.register(PROJECT_REPORT_VIEW_PREFIX, ProjectReportViewset, basename='project-report')

urlpatterns = router.urls
