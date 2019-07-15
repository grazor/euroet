import factory
from faker import Faker

from server.pm.models import Collection
from server.lib.factory_seed import faker


class CollectionFactory(factory.DjangoModelFactory):
    class Meta:
        model = Collection

    name = factory.Sequence(lambda n: '{} {}'.format(n, faker.sentence(nb_words=3)))
    description = factory.LazyAttribute(lambda _: faker.text(max_nb_chars=200))
    discount = factory.LazyAttribute(lambda _: faker.pydecimal(left_digits=2, right_digits=1))
