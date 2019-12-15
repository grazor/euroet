import factory

from server.pm.models import Entry
from server.lib.factory_seed import faker, get_seed_model
from server.pm.factories.group import GroupFactory
from server.pm.factories.component import ComponentFactory


class EntryFactory(factory.DjangoModelFactory):
    class Meta:
        model = Entry

    custom_name = factory.LazyAttribute(lambda _: faker.sentence(nb_words=5))
    custom_price = factory.LazyAttribute(lambda _: abs(faker.pydecimal(left_digits=3, right_digits=2)))

    group = factory.SubFactory(GroupFactory)
    prototype = factory.SubFactory(ComponentFactory)
    qty = factory.LazyAttribute(lambda _: faker.randint(1, 100))

    class Params:
        seed = factory.Trait(
            prototype=factory.LazyAttribute(lambda _: get_seed_model(ComponentFactory, nullable=True, generate=False))
        )
