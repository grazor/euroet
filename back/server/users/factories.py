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
    photo = factory.LazyAttribute(lambda _: faker.uri_path())

    password = factory.PostGenerationMethodCall('set_password', '123')


class AdminFactory(UserFactory):
    email = factory.Sequence(lambda n: f'admin{n}@test.test')
    is_staff = True
    is_superuser = True


class EngineerFactory(UserFactory):
    email = factory.Sequence(lambda n: f'engineer{n}@test.test')


class ManagerFactory(UserFactory):
    email = factory.Sequence(lambda n: f'manager{n}@test.test')

