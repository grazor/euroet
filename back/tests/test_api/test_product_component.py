from django.urls import reverse

from server.pm.factories import ComponentFactory, ProductComponentFactory


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
