from django.urls import reverse

from server.pm.models import ProjectAccess
from server.pm.factories import ProjectFactory, ReadProjectAccessFactory
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

    url = reverse('project-list')
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
    p3 = ProjectFactory(created_by=AdminFactory())
    ReadProjectAccessFactory(user=user, project=p3)

    url = reverse('project-list')
    api_client.force_authenticate(user=user)
    response = api_client.get(url)
    assert response.status_code == 200

    data = response.json()
    assert len(data) == 2
    assert {p2.slug, p3.slug} == {p['slug'] for p in data}


def test_detail_allowed_only(db, api_client):
    user1 = ManagerFactory()
    user2 = ManagerFactory()

    p1 = ProjectFactory(created_by=user1)
    p2 = ProjectFactory(created_by=user2)
    p3 = ProjectFactory(created_by=user2)
    ReadProjectAccessFactory(user=user1, project=p3)

    api_client.force_authenticate(user=user1)

    url = reverse('project-detail', kwargs={'pk': p1.slug})
    response = api_client.get(url)
    assert response.status_code == 200, 'Can not acces own project'

    url = reverse('project-detail', kwargs={'pk': p2.slug})
    response = api_client.get(url)
    assert response.status_code == 404, 'Can access soneone else\'s project'

    url = reverse('project-detail', kwargs={'pk': p3.slug})
    response = api_client.get(url)
    assert response.status_code == 200, 'Can not access shared to read project'


def test_update_with_write_access_only(db, api_client):
    user = ManagerFactory()
    project = ProjectFactory(created_by=user)
    access = project.access.get(user=user)
    access.access_type = ProjectAccess.AccessType.read.name
    access.save()

    api_client.force_authenticate(user=user)

    url = reverse('project-detail', kwargs={'pk': project.slug})
    response = api_client.patch(url, data={'name': 'test_name'})
    assert response.status_code == 403, 'Can modify someone else\'s project'

    access.access_type = ProjectAccess.AccessType.write.name
    access.save()
    response = api_client.patch(url, data={'name': 'test_name2'})
    project.refresh_from_db()
    assert response.status_code == 200, 'Can not modify shared to write project'
    assert project.name == 'test_name2'
