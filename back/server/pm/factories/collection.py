import factory
from faker import Faker

from server.pm.models import Collection

faker = Faker()


class CollectionFactory(factory.DjangoModelFactory):
    class Meta:
        model = Collection

    name = factory.Sequence(lambda x: '{0} {1}'.format(faker.sentence(nb_words=3), x))
    slug = factory.LazyAttribute(lambda x: x.name.replace(' ', '_').lower()[-16:])
    desctiption = factory.LazyAttribute(lambda _: faker.text(max_nb_chars=200))

    discount = factory.LazyAttribute(lambda _: faker.pydecimal(left_digits=1, right_digits=1))
