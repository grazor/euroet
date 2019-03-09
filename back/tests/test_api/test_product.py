from django.urls import reverse

from server.pm.factories import ProjectFactory, ReadProjectAccessFactory, WriteProjectAccessFactory
from server.users.factories import AdminFactory, ManagerFactory


def test_products_list_has_permission(db, api_client):
    user = ManagerFactory()
    p1 = ProjectFactory(created_by=user)

    url = reverse('product-list', kwargs={'project_slug': p1.slug})
    api_client.force_authenticate(user=user)
    response = api_client.get(url)
    assert response.status_code == 200, 'Can not access own products'


def test_products_list_no_permission(db, api_client):
    user1 = ManagerFactory()
    user2 = ManagerFactory()
    p2 = ProjectFactory(created_by=user2)

    url = reverse('product-list', kwargs={'project_slug': p2.slug})
    api_client.force_authenticate(user=user1)
    response = api_client.get(url)
    assert response.status_code == 403, 'Can access someone else\'s project'


def test_products_list_read_permission(db, api_client):
    user1 = ManagerFactory()
    user2 = ManagerFactory()
    p2 = ProjectFactory(created_by=user2)
    ReadProjectAccessFactory(user=user1, project=p2)

    url = reverse('product-list', kwargs={'project_slug': p2.slug})
    api_client.force_authenticate(user=user1)
    response = api_client.get(url)
    assert response.status_code == 200, 'Read access does not work'


def test_products_list_admin(db, api_client):
    admin = AdminFactory()
    user1 = ManagerFactory()
    p1 = ProjectFactory(created_by=user1)

    url = reverse('product-list', kwargs={'project_slug': p1.slug})
    api_client.force_authenticate(user=admin)
    response = api_client.get(url)
    assert response.status_code == 200, 'Admin has no access to project'


def test_product_add_write_permission(db, api_client):
    user1 = ManagerFactory()
    user2 = ManagerFactory()
    p2 = ProjectFactory(created_by=user2)
    WriteProjectAccessFactory(user=user1, project=p2)

    url = reverse('product-list', kwargs={'project_slug': p2.slug})
    api_client.force_authenticate(user=user1)
    response = api_client.post(url, data={'slug': 'test', 'name': 'test'})
    assert response.status_code == 201, 'Read access does not work'
    assert p2.products.get().slug == 'test'


def test_product_add_read_permission_fails(db, api_client):
    user1 = ManagerFactory()
    user2 = ManagerFactory()
    p2 = ProjectFactory(created_by=user2)
    ReadProjectAccessFactory(user=user1, project=p2)

    url = reverse('product-list', kwargs={'project_slug': p2.slug})
    api_client.force_authenticate(user=user1)
    response = api_client.post(url, data={'slug': 'test', 'name': 'test'})
    assert response.status_code == 403, 'Can create products with read permission'
