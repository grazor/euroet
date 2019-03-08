import factory
from faker import Faker

from server.pm.models import Project
from server.users.factories import UserFactory

faker = Faker()


class ProjectFactory(factory.DjangoModelFactory):
    class Meta:
        model = Project

    slug = factory.Sequence(lambda x: f'project_{x}')
    name = factory.LazyAttribute(lambda _: faker.sentence(nb_words=4))
    description = factory.LazyAttribute(lambda _: faker.text(max_nb_chars=200))

    created_by = factory.SubFactory(UserFactory)

    is_frozen = False
    is_removed = False


class FrozenProjectFactory(ProjectFactory):
    is_frozen = True


class RemovedProjectFactory(ProjectFactory):
    is_removed = True
