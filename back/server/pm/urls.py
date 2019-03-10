from rest_framework import routers

from server.pm.views.product import ProductViewset
from server.pm.views.project import ProjectViewset
from server.pm.views.product_component import ProductComponentViewset

PROJECT_URL_PREFIX = r'projects/(?P<project_slug>[\w_-]+)/products'
PROJECT_COMPONENT_URL_PREFIX = r'{0}/(?P<product_slug>[\w_-]+)/components'.format(
    PROJECT_URL_PREFIX
)

router = routers.DefaultRouter()
router.register('projects', ProjectViewset, basename='project')
router.register(PROJECT_URL_PREFIX, ProductViewset, basename='product')
router.register(PROJECT_COMPONENT_URL_PREFIX, ProductComponentViewset, basename='product-component')

urlpatterns = router.urls
