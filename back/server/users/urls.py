from knox import views as knox_views

from django.urls import path, include

from server.users.views import LoginView, UserInfoView

knox_urlpatterns = [
    path('login/', LoginView.as_view(), name='knox_login'),
    path('logout/', knox_views.LogoutView.as_view(), name='knox_logout'),
    path('logoutall/', knox_views.LogoutAllView.as_view(), name='knox_logoutall'),
]

urlpatterns = [
    path('auth/', include(knox_urlpatterns)),
    path('user/', UserInfoView.as_view(), name='user_info'),
]
