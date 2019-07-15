import factory

from server.pm.models import Project
from server.users.factories import UserFactory, EngineerFactory
from server.lib.factory_seed import faker, get_seed_model


class ProjectFactory(factory.DjangoModelFactory):
    class Meta:
        model = Project

    slug = factory.LazyFunction(faker.et_slug)
    name = factory.LazyAttribute(lambda _: faker.sentence(nb_words=5))
    description = factory.LazyAttribute(lambda _: faker.text(max_nb_chars=400))

    created_by = factory.SubFactory(EngineerFactory)
    deleted_at = None


class ProjectSeedFactory(ProjectFactory):
    created_by = factory.LazyAttribute(lambda _: get_seed_model(UserFactory, nullable=False, generate=False))
    products = factory.RelatedFactoryList(
        'server.pm.factories.product.ProductFactory',
        size=lambda: faker.randint(0, 5),
        factory_related_name='project',
        seed=True,
    )
