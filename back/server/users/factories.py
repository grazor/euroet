import factory
from faker import Faker

from server.users.models import User

faker = Faker()


class UserFactory(factory.DjangoModelFactory):
    class Meta:
        model = User

    is_staff = False
    is_superuser = False
    email = factory.LazyAttribute(lambda _: faker.email())
    username = factory.LazyAttribute(lambda _: faker.user_name())
    first_name = factory.LazyAttribute(lambda _: faker.first_name())
    last_name = factory.LazyAttribute(lambda _: faker.last_name())
    email = factory.LazyAttribute(lambda _: faker.email())
    photo = factory.LazyAttribute(lambda _: faker.uri_path())


class AdminFactory(UserFactory):
    is_staff = True
    is_superuser = True
    role = User.Roles.admin.name


class EngineerFactory(UserFactory):
    role = User.Roles.engineer.name


class ManagerFactory(UserFactory):
    role = User.Roles.manager.name


class GuestFactory(UserFactory):
    role = User.Roles.guest.name
