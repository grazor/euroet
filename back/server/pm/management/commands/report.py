# flake8: noqa

from django.core.management.base import BaseCommand

from server.pm.models import Product
from server.pm.logic.report import report_product


class Command(BaseCommand):
    def add_arguments(self, parser):
        parser.add_argument('project')
        parser.add_argument('product')

    def handle(self, *args, **options):
        try:
            product = Product.objects.get(project__slug=options['project'], slug=options['product'])
        except Product.DoesNotExist:
            print('Product not found')
            return

        report = report_product(product)
        print(f'Report has been created {report}')
