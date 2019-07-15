from random import choice, randint

from faker import Faker, Generator


class EtGenerator(Generator):
    randint = randint

    def et_slug(self, nb_words=3):
        return '_'.join(self.words(nb=nb_words, unique=True)).lower()


faker = Faker(generator=EtGenerator())


def get_seed_model(factory, nullable=True, generate=True, choose=True):
    """Returns randomly either None or existing instance of factory.Model or new one."""
    Model = factory._meta.model

    actions = filter(None, {nullable and 'none', generate and 'generate', choose and 'choose'})
    action = choice(list(actions))
    if action == 'none':
        return None
    if action == 'generate':
        return factory()
    return Model.objects.order_by('?').first()
