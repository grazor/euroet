import factory
from faker import Faker

from server.pm.models import ProjectAccess
from server.pm.factories import ProjectFactory
from server.users.factories import UserFactory

faker = Faker()


class ProjectAccessFactory(factory.DjangoModelFactory):
    project = factory.SubFactory(ProjectFactory)
    user = factory.SubFactory(UserFactory)
    is_starred = False


class OwnProjectAccess(ProjectAccessFactory):
    access_type = ProjectAccess.AccessType.own.name


class ReadProjectAccess(ProjectAccessFactory):
    access_type = ProjectAccess.AccessType.read.name


class WriteProjectAccess(ProjectAccessFactory):
    access_type = ProjectAccess.AccessType.write.name
