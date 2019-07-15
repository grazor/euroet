import factory

from server.pm.models import Product
from server.users.factories import UserFactory
from server.lib.factory_seed import faker, get_seed_model
from server.pm.factories.project import ProjectFactory


class ProductFactory(factory.DjangoModelFactory):
    class Meta:
        model = Product

    slug = factory.LazyFunction(faker.et_slug)
    name = factory.LazyAttribute(lambda _: faker.sentence(nb_words=5))
    description = factory.LazyAttribute(lambda _: faker.text(max_nb_chars=400))

    project = factory.SubFactory(ProjectFactory)
    deleted_at = None

    class Params:
        seed = factory.Trait(
            groups=factory.RelatedFactoryList(
                'server.pm.factories.group.GroupFactory',
                size=lambda: faker.randint(1, 5),
                factory_related_name='product',
                seed=True,
            ),
            created_by=factory.LazyAttribute(lambda _: get_seed_model(UserFactory, nullable=True, generate=False)),
        )
