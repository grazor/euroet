from random import random


def get_seed_model(factory):
    """Returns randomly either None or existing instance of factory.Model or new one."""
    Model = factory._meta.model
    value = random()
    if value <= 0.33:
        return None
    elif value <= 0.66:
        return Model.objects.order_by('?').first()
    else:
        return factory()
