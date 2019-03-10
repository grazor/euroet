from django.urls import reverse

from server.pm.factories import ProductFactory, ComponentFactory, ProductComponentFactory


def test_product_component_retreive(db, api_client):
    product_component = ProductComponentFactory()
    product = product_component.product
    component = product_component.component

    url = reverse(
        'product-component-detail',
        kwargs={'project_slug': product.project.slug, 'product_slug': product.slug, 'code': component.code},
    )
    api_client.force_authenticate(user=product.project.created_by)
    response = api_client.get(url)
    assert response.status_code == 200, 'Can not access product component'


def test_product_component_retreive_nonexistenr(db, api_client):
    product_component = ProductComponentFactory()
    product = product_component.product
    component = ComponentFactory()

    url = reverse(
        'product-component-detail',
        kwargs={'project_slug': product.project.slug, 'product_slug': product.slug, 'code': component.code},
    )
    api_client.force_authenticate(user=product.project.created_by)
    response = api_client.get(url)
    assert response.status_code == 404, 'Can not access product component'


def test_add_component(db, api_client):
    product_component = ProductComponentFactory()
    product = product_component.product
    component = ComponentFactory()

    url = reverse(
        'product-component-list', kwargs={'project_slug': product.project.slug, 'product_slug': product.slug}
    )
    api_client.force_authenticate(user=product.project.created_by)
    response = api_client.post(url, data={'component': component.id, 'qty': 10})
    assert response.status_code == 200, 'Can not add components to product'

    data = response.json()
    assert data['component']['code'] == component.code
    assert data['qty'] == 10


def test_add_duplicate_component(db, api_client):
    product_component = ProductComponentFactory(qty=10)
    product = product_component.product
    component = product_component.component

    url = reverse(
        'product-component-list', kwargs={'project_slug': product.project.slug, 'product_slug': product.slug}
    )
    api_client.force_authenticate(user=product.project.created_by)
    response = api_client.post(url, data={'component': component.id, 'qty': 20})
    assert response.status_code == 400, 'Can create duplicate component'

    product_component.refresh_from_db()
    assert product_component.qty == 10


def test_find_components(db, api_client):
    good = [ComponentFactory(code='Test 1'), ComponentFactory(code='Component teset'), ComponentFactory(code='Testo')]
    other = [ComponentFactory(code='Other'), ComponentFactory(code='Something else')]
    product = ProductFactory()

    url = reverse(
        'product-component-find', kwargs={'project_slug': product.project.slug, 'product_slug': product.slug}
    )
    api_client.force_authenticate(user=product.project.created_by)
    response = api_client.get(url, data={'q': 'test'})
    assert response.status_code == 200, 'Can not get recommendations'

    data = response.json()
    assert {x['code'] for x in data} == {x.code for x in good}
    assert not {x['code'] for x in data}.intersection({x.code for x in other})
