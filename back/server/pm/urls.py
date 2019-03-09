from rest_framework import routers

from server.pm.views.project import ProjectViewset

router = routers.DefaultRouter()
router.register('projects', ProjectViewset, basename='project')

urlpatterns = router.urls
