from rest_framework import routers

from server.pm.views.product import ProductViewset
from server.pm.views.project import ProjectViewset

router = routers.DefaultRouter()
router.register('projects', ProjectViewset, basename='project')
router.register(r'projects/(?P<project_slug>[\w_-]+)/products', ProductViewset, basename='product')

urlpatterns = router.urls
