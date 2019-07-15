from rest_framework import routers

from server.pm.views.entry import EntryViewset
from server.pm.views.product import ProductViewset
from server.pm.views.project import ProjectViewset
from server.pm.views.component import ComponentViewset

PROJECT_VIEW_PREFIX = r'projects/(?P<project_slug>[\w_-]+)/products'
ENTRY_URL_PREFIX = r'{0}/(?P<product_slug>[\w_-]+)'.format(PROJECT_VIEW_PREFIX)
ENTRY_VIEW_PREFIX = r'{0}/components'.format(ENTRY_URL_PREFIX)

router = routers.DefaultRouter()
router.register('components', ComponentViewset, basename='component')
router.register('projects', ProjectViewset, basename='project')
router.register(PROJECT_VIEW_PREFIX, ProductViewset, basename='product')
router.register(ENTRY_VIEW_PREFIX, EntryViewset, basename='entry')

urlpatterns = router.urls
