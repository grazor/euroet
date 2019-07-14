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


class EngineerFactory(UserFactory):
    pass


class ManagerFactory(UserFactory):
    pass


class GuestFactory(UserFactory):
    pass
