import factory

from django.contrib.auth.models import Group, Permission

from server.pm.models import ProjectPermission
from server.users.models import User
from server.lib.factory_seed import faker


def get_engineer_group():
    group, created = Group.objects.get_or_create(name='Engineer')
    if created:
        group.permissions.add(Permission.objects.get(codename=ProjectPermission.can_create_projects.name))
    return group


def get_manager_group():
    group, created = Group.objects.get_or_create(name='Manager')
    if created:
        group.permissions.add(Permission.objects.get(codename=ProjectPermission.can_manage_projects.name))
    return group


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

    @factory.post_generation
    def group(self, create, extracted, **kwargs):
        if not create:
            return
        self.groups.add(get_engineer_group())


class ManagerFactory(UserFactory):
    email = factory.Sequence(lambda n: f'manager{n}@test.test')

    @factory.post_generation
    def group(self, create, extracted, **kwargs):
        if not create:
            return
        self.groups.add(get_manager_group())
