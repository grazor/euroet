import factory
from faker import Faker
from factory import fuzzy

from server.pm.models import ProductComponent
from server.pm.factories.product import ProductFactory
from server.pm.factories.component import ComponentFactory

faker = Faker()


class ProductComponentFactory(factory.DjangoModelFactory):
    class Meta:
        model = ProductComponent

    product = factory.SubFactory(ProductFactory)
    component = factory.SubFactory(ComponentFactory)

    qty = fuzzy.FuzzyInteger(1, 100)
