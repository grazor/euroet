# flake8: noqa

import csv
from decimal import Decimal

from django.db import IntegrityError
from django.core.management.base import BaseCommand

from server.pm.models import Component, Collection
from server.users.models import User

ACTIONS = ['retreived', 'created']

collections = {}  # type: ignore


class Command(BaseCommand):
    def add_arguments(self, parser):
        parser.add_argument('file')

    def handle(self, *args, **options):
        components = []
        with open(options['file'], 'r') as f:
            reader = csv.reader(f)
            next(reader)
            for row in reader:
                if len(row) < 7:
                    continue

                code, name, _, price, _, _, colname, *_ = row

                if not colname:
                    collection = None
                else:
                    collection = collections.get(colname)
                    if not collection:
                        collection, created = Collection.objects.get_or_create(
                            slug=colname.replace(' ', '_').lower(), defaults={'name': colname}
                        )
                        collections[colname] = collection
                        action = ACTIONS[created]
                        print(f'Collection {action} {collection}')

                components.append(
                    Component(
                        code=code, description=name, price=Decimal(price.replace(',', '.')), collection=collection
                    )
                )
                if len(components) >= 5000:
                    try:
                        Component.objects.bulk_create(components)
                        print(f'Created {len(components)} components, latest: {components[-1].code}')
                    except IntegrityError:
                        print(f'Failed to create {len(components)} components, latest: {components[-1].code}')
                    finally:
                        components = []

            if components:
                Component.objects.bulk_create(components)
                print(f'Created {len(components)} components, latest: {components[-1].code}')
                components = []
