import factory
from faker import Faker

from server.pm.models import Component
from server.users.factories import AdminFactory
from server.pm.factories.collection import CollectionFactory

faker = Faker()


class ComponentFactory(factory.DjangoModelFactory):
    class Meta:
        model = Component

    code = factory.Sequence(lambda x: f'component_{x}')
    description = factory.LazyAttribute(lambda _: faker.text(max_nb_chars=200))

    created_by = factory.SubFactory(AdminFactory)

    price = factory.LazyAttribute(lambda _: faker.pydecimal(left_digits=3, right_digits=2))
    collection = factory.SubFactory(CollectionFactory)
