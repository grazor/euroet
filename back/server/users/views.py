from knox.views import LoginView as KnoxLoginView
from rest_framework import permissions

from django.contrib.auth import login

from server.users.serializers import UserTokenSerializer


class LoginView(KnoxLoginView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, fmt=None):
        serializer = UserTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        login(request, user)
        return super(LoginView, self).post(request, format=None)
