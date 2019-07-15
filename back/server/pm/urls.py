from rest_framework import routers

from server.pm.views.project import ProjectViewset

PROJECT_VIEW_PREFIX = r'projects/(?P<project_slug>[\w_-]+)/products'

router = routers.DefaultRouter()
router.register('projects', ProjectViewset, basename='project')

urlpatterns = router.urls

