import factory

from server.pm.models import Group
from server.lib.factory_seed import faker, get_seed_model
from server.pm.factories.product import ProductFactory


class GroupFactory(factory.DjangoModelFactory):
    class Meta:
        model = Group

    name = factory.LazyAttribute(lambda _: faker.sentence(nb_words=5))
    product = factory.SubFactory(ProductFactory)

    class Params:
        seed = factory.Trait(
            entry=factory.RelatedFactoryList(
                'server.pm.factories.entry.EntryFactory',
                size=lambda: faker.randint(0, 30),
                factory_related_name='group',
                seed=True,
            )
        )

