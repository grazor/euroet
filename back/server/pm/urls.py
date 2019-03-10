from rest_framework import routers

from server.pm.views.product import ProductViewset
from server.pm.views.project import ProjectViewset
from server.pm.views.component import ComponentViewset
from server.pm.views.product_component import ProductComponentViewset

PROJECT_VIEW_PREFIX = r'projects/(?P<project_slug>[\w_-]+)/products'
PROJECT_COMPONENT_URL_PREFIX = r'{0}/(?P<product_slug>[\w_-]+)'.format(PROJECT_VIEW_PREFIX)
PROJECT_COMPONENT_VIEW_PREFIX = r'{0}/components'.format(PROJECT_COMPONENT_URL_PREFIX)

router = routers.DefaultRouter()
router.register('projects', ProjectViewset, basename='project')
router.register(PROJECT_VIEW_PREFIX, ProductViewset, basename='product')
router.register(PROJECT_COMPONENT_VIEW_PREFIX, ProductComponentViewset, basename='product-component')
router.register('components', ComponentViewset, basename='component')

urlpatterns = router.urls
