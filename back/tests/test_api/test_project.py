from django.urls import reverse

from server.pm.models import ProjectAccess
from server.pm.factories import ProjectFactory
from server.users.factories import AdminFactory, ManagerFactory


def test_project_ownership(db):
    user = ManagerFactory()
    project = ProjectFactory(created_by=user)
    assert project.created_by == user

    access = project.access.all()
    assert len(access) == 1
    access = access[0]

    assert access.access_type == ProjectAccess.AccessType.own.name
    assert access.user == user


def test_project_list_as_admin(db, api_client):
    admin = AdminFactory()

    p1 = ProjectFactory(created_by=admin)
    p2 = ProjectFactory(created_by=ManagerFactory())

    url = reverse('projects-list')
    api_client.force_authenticate(user=admin)
    response = api_client.get(url)
    assert response.status_code == 200

    data = response.json()
    assert len(data) == 2
    assert {p1.slug, p2.slug} == {p['slug'] for p in data}


def test_project_list_as_user(db, api_client):
    user = ManagerFactory()

    ProjectFactory(created_by=AdminFactory())
    p2 = ProjectFactory(created_by=user)

    url = reverse('projects-list')
    api_client.force_authenticate(user=user)
    response = api_client.get(url)
    assert response.status_code == 200

    data = response.json()
    assert len(data) == 1
    assert p2.slug == data[0]['slug']
