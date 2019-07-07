import random
from typing import Any, Dict, List, Union

from django_seed import Seed

from django.core.management.base import BaseCommand

from server.pm.models import Group, Report, Product, Project, Component, Collection, ProjectAccess, ProductComponent
from server.users.models import User

populator = Seed.seeder()
faker = Seed.faker()

entries = ((User, 10), (Collection, 7), (Component, 150), (Project, 5), (Product, 15), (Group, 10))


def slug():
    return '_'.join(faker.words(nb=3, unique=True)).lower()


def populate_access(populated: Dict[Any, List[Union[str, int]]]) -> None:
    for pid in populated[Project]:
        project = Project.objects.get(id=pid)

        project.frozen_at = None
        if random.random() > 0.25:  # noqa: S311
            project.deleted_at = None
        project.save()

        users = list(populated[User])
        random.shuffle(users)  # noqa: S311
        for _ in range(random.randrange(len(users))):  # noqa: S311
            user = users.pop()
            if project.created_by_id == user:
                continue
            populated.setdefault(ProjectAccess, []).append(
                ProjectAccess.objects.create(
                    user_id=user,
                    project=project,
                    access_type=random.choice(  # noqa: S311
                        [ProjectAccess.AccessType.read.name, ProjectAccess.AccessType.write.name]
                    ),
                    is_starred=random.random() > 0.8,  # noqa: S311
                )
            )


def populate_components(populated: Dict[Any, List[Union[str, int]]]) -> None:
    for group in populated[Group]:
        components = list(populated[Component])
        random.shuffle(components)  # noqa: S311
        for _ in range(random.randrange(min(len(components), 15))):  # noqa: S311
            component = components.pop()
            populated.setdefault(ProductComponent, []).append(
                ProductComponent.objects.create(
                    group_id=group, component_id=component, qty=random.randrange(1, 100)  # noqa: S311
                )
            )


def reset_merged_field(populated: Dict[Any, List[Union[str, int]]]) -> None:
    components = populated[Component]
    Component.objects.filter(id__in=components).update(merged_to=None)


def create_superuser() -> None:
    su, created = User.objects.get_or_create(
        email='test@test.test',
        defaults={
            'username': 'test',
            'first_name': 'First',
            'last_name': 'Last',
            'is_staff': True,
            'is_superuser': True,
            'role': User.Roles.admin.name,
        },
    )

    if created:
        su.set_password('123')
        su.save()


class Command(BaseCommand):
    def handle(self, *args, **options):
        faker.uri_page = slug

        create_superuser()

        for entry, number in entries:
            populator.add_entity(entry, number=number)

        populated = populator.execute()
        populate_access(populated)
        populate_components(populated)
        reset_merged_field(populated)
