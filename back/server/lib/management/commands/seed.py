import random
import logging
from collections import namedtuple

from django.db import IntegrityError
from django.db.models import Max
from django.core.management.base import BaseCommand

from server.pm.factories import ComponentFactory, ProjectSeedFactory
from server.users.factories import AdminFactory, ManagerFactory, EngineerFactory

Rule = namedtuple('Rule', ('Factory', 'amount', 'seed_arg', 'seed_max_id'))

logger = logging.getLogger(__name__)

rules = (
    Rule(AdminFactory, 3, False, False),
    Rule(ManagerFactory, 3, False, False),
    Rule(EngineerFactory, 10, False, False),
    Rule(ComponentFactory, 1000, True, True),
    Rule(ProjectSeedFactory, 10, False, True),
)


class Command(BaseCommand):
    def handle(self, *args, **options):
        for rule in rules:
            try:
                kwargs = {'seed': True} if rule.seed_arg else {}
                if rule.seed_max_id:
                    Model = rule.Factory._meta.model
                    sequence = Model.objects.aggregate(sequence=Max('id')).get('sequence')
                    rule.Factory.reset_sequence(value=sequence, force=True)

                rule.Factory.create_batch(rule.amount, **kwargs)
                logger.info(f'Created {rule.amount:03d} of {rule.Factory}')
            except IntegrityError:
                logger.info(f'Failed to create {rule.amount:03d} of {rule.Factory}')
            except:
                logger.exception(f'Unknown error while creating {rule.amount:03d} of {rule.Factory}')
