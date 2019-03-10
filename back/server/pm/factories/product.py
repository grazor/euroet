import factory
from faker import Faker

from server.pm.models import Product
from server.users.factories import UserFactory
from server.pm.factories.project import ProjectFactory

faker = Faker()


class ProductFactory(factory.DjangoModelFactory):
    class Meta:
        model = Product

    slug = factory.Sequence(lambda x: f'product_{x}')
    name = factory.LazyAttribute(lambda _: faker.sentence(nb_words=4))
    description = factory.LazyAttribute(lambda _: faker.text(max_nb_chars=200))

    project = factory.SubFactory(ProjectFactory)
    created_by = factory.SubFactory(UserFactory)
