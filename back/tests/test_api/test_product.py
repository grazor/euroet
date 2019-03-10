from django.urls import reverse

from server.pm.factories import ProjectFactory, ReadProjectAccessFactory, WriteProjectAccessFactory
from server.users.factories import AdminFactory, ManagerFactory


def test_products_list_has_permission(db, api_client):
    project = ProjectFactory(created_by=ManagerFactory())

    url = reverse('product-list', kwargs={'project_slug': project.slug})
    api_client.force_authenticate(user=project.created_by)
    response = api_client.get(url)
    assert response.status_code == 200, 'Can not access own products'


def test_products_list_no_permission(db, api_client):
    user = ManagerFactory()
    project = ProjectFactory()

    url = reverse('product-list', kwargs={'project_slug': project.slug})
    api_client.force_authenticate(user=user)
    response = api_client.get(url)
    assert response.status_code == 403, 'Can access someone else\'s project'


def test_products_list_read_permission(db, api_client):
    project = ProjectFactory(created_by=ManagerFactory())
    access = ReadProjectAccessFactory(user=ManagerFactory(), project=project)

    url = reverse('product-list', kwargs={'project_slug': project.slug})
    api_client.force_authenticate(user=access.user)
    response = api_client.get(url)
    assert response.status_code == 200, 'Read access does not work'


def test_products_list_admin(db, api_client):
    admin = AdminFactory()
    project = ProjectFactory(created_by=ManagerFactory())

    url = reverse('product-list', kwargs={'project_slug': project.slug})
    api_client.force_authenticate(user=admin)
    response = api_client.get(url)
    assert response.status_code == 200, 'Admin has no access to project'


def test_product_add_write_permission(db, api_client):
    project = ProjectFactory(created_by=ManagerFactory())
    access = WriteProjectAccessFactory(user=ManagerFactory(), project=project)

    url = reverse('product-list', kwargs={'project_slug': project.slug})
    api_client.force_authenticate(user=access.user)
    response = api_client.post(url, data={'slug': 'test', 'name': 'test'})
    assert response.status_code == 201, 'Write access does not work'
    assert project.products.get().slug == 'test'


def test_product_add_read_permission_fails(db, api_client):
    project = ProjectFactory(created_by=ManagerFactory())
    access = ReadProjectAccessFactory(user=ManagerFactory(), project=project)

    url = reverse('product-list', kwargs={'project_slug': project.slug})
    api_client.force_authenticate(user=access.user)
    response = api_client.post(url, data={'slug': 'test', 'name': 'test'})
    assert response.status_code == 403, 'Can create products with read permission'
