import factory
from faker import Faker

from server.pm.models import ProjectAccess
from server.users.factories import UserFactory
from server.pm.factories.project import ProjectFactory

faker = Faker()


class ProjectAccessFactory(factory.DjangoModelFactory):
    class Meta:
        model = ProjectAccess

    project = factory.SubFactory(ProjectFactory)
    user = factory.SubFactory(UserFactory)
    is_starred = False


class OwnProjectAccessFactory(ProjectAccessFactory):
    access_type = ProjectAccess.AccessType.own.name


class ReadProjectAccessFactory(ProjectAccessFactory):
    access_type = ProjectAccess.AccessType.read.name


class WriteProjectAccessFactory(ProjectAccessFactory):
    access_type = ProjectAccess.AccessType.write.name
