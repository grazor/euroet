import factory
from faker import Faker

from server.pm.models import Manufacturer
from server.lib.factory_seed import faker


class ManufacturerFactory(factory.DjangoModelFactory):
    class Meta:
        model = Manufacturer

    name = factory.Sequence(lambda n: '{} {}'.format(n, faker.sentence(nb_words=3)))
    description = factory.LazyAttribute(lambda _: faker.text(max_nb_chars=200))

