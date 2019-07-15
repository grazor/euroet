from decimal import Decimal

import factory

from server.pm.models import Entry
from server.lib.factory_seed import faker, get_seed_model
from server.pm.factories.group import GroupFactory
from server.pm.factories.component import ComponentFactory


class EntryFactory(factory.DjangoModelFactory):
    class Meta:
        model = Entry

    code = factory.Sequence(lambda n: f'component_{n}')
    name = factory.LazyAttribute(lambda _: faker.sentence(nb_words=5))
    price = factory.LazyAttribute(lambda _: abs(faker.pydecimal(left_digits=3, right_digits=2)))
    collection_discount = factory.LazyAttribute(lambda _: faker.pydecimal(left_digits=2, right_digits=1))

    group = factory.SubFactory(GroupFactory)
    prototype = factory.SubFactory(ComponentFactory)
    qty = factory.LazyAttribute(lambda _: faker.randint(1, 500))

    class Params:
        seed = factory.Trait(
            prototype=factory.LazyAttribute(lambda _: get_seed_model(ComponentFactory, nullable=True, generate=False))
        )

    @factory.post_generation
    def make_consistent(obj, create, extracted, **kwargs):
        if not create:
            return
        obj.make_consistent()
