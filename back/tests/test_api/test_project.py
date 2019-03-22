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
    project1 = ProjectFactory(created_by=AdminFactory())
    project2 = ProjectFactory(created_by=ManagerFactory())

    url = reverse('project-list')
    api_client.force_authenticate(user=project1.created_by)
    response = api_client.get(url)
    assert response.status_code == 200, 'Admin can not list all projects'

    data = response.json()
    assert len(data) == 2
    assert {project1.slug, project2.slug} == {p['slug'] for p in data}


def test_project_list_as_user(db, api_client):
    project = ProjectFactory(created_by=ManagerFactory())
    access = ReadProjectAccessFactory(user=project.created_by, project=ProjectFactory())
    ProjectFactory(created_by=AdminFactory())

    url = reverse('project-list')
    api_client.force_authenticate(user=project.created_by)
    response = api_client.get(url)
    assert response.status_code == 200, 'User can not list projects'

    data = response.json()
    assert len(data) == 2, 'User permissions error'
    assert {project.slug, access.project.slug} == {p['slug'] for p in data}


def test_detail_access_own(db, api_client):
    project = ProjectFactory(created_by=ManagerFactory())

    api_client.force_authenticate(user=project.created_by)
    url = reverse('project-detail', kwargs={'slug': project.slug})
    response = api_client.get(url)
    assert response.status_code == 200, 'Can not acces own project'


def test_detail_no_access_fails(db, api_client):
    user = ManagerFactory()
    project = ProjectFactory(created_by=ManagerFactory())

    api_client.force_authenticate(user=user)
    url = reverse('project-detail', kwargs={'slug': project.slug})
    response = api_client.get(url)
    assert response.status_code == 404, 'Can access soneone else\'s project'


def test_detail_read_access(db, api_client):
    user = ManagerFactory()
    access = ReadProjectAccessFactory(user=user, project=ProjectFactory(created_by=ManagerFactory()))

    api_client.force_authenticate(user=user)
    url = reverse('project-detail', kwargs={'slug': access.project.slug})
    response = api_client.get(url)
    assert response.status_code == 200, 'Can not access shared to read project'
