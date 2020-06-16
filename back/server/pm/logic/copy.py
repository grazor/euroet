from collections import OrderedDict

from server.pm.models import Entry, Group, Product, Project


def copy_product(product: Product, target_project: Project, target_slug: str) -> Product:
    original_product = Product.objects.get(id=product.id)

    product.id = None
    product.project = target_project
    product.slug = target_slug
    product.save()

    groups = OrderedDict()
    for group in original_product.group_set.all():
        original_group = Group.objects.get(id=group.id)
        group.id = None
        group.product = product
        groups[original_group] = group
    Group.objects.bulk_create(groups.values())

    for original_group, group in groups.items():
        entries = []
        for entry in original_group.entries.all():
            entry.id = None
            entry.group = group
            entries.append(entry)
        Entry.objects.bulk_create(entries)

    return product
