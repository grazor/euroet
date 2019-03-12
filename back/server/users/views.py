from knox.views import LoginView as KnoxLoginView

from rest_framework import permissions
from django.contrib.auth import login

from server.users.serializers import UserTokenSerializer, UserSerializer


class LoginView(KnoxLoginView):
    permission_classes = (permissions.AllowAny,)

    def get_user_serializer_class(self):
        return UserSerializer

    def get_query(self):
        q = super().get_query()
        return q.select_related('authtoken')

    def post(self, request, fmt=None):
        serializer = UserTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        login(request, user)
        return super(LoginView, self).post(request, format=None)
