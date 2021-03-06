import factory

from server.pm.models import Component
from server.lib.factory_seed import faker, get_seed_model
from server.pm.factories.collection import CollectionFactory
from server.pm.factories.manufacturer import ManufacturerFactory


class ComponentFactory(factory.DjangoModelFactory):
    class Meta:
        model = Component

    code = factory.Sequence(lambda n: f'{faker.slug()}_{n}')
    name = factory.LazyAttribute(lambda _: faker.sentence(nb_words=5))
    price = factory.LazyAttribute(lambda _: abs(faker.pydecimal(left_digits=3, right_digits=2)))
    collection = factory.SubFactory(CollectionFactory)
    manufacturer = factory.SubFactory(ManufacturerFactory)

    class Params:
        seed = factory.Trait(
            collection=factory.LazyAttribute(lambda _: get_seed_model(CollectionFactory)),
            manufacturer=factory.LazyAttribute(lambda _: get_seed_model(ManufacturerFactory)),
        )
