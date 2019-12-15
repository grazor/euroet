from tempfile import TemporaryFile

import pytest

from django.urls import reverse


@pytest.fixture(scope='module', autouse=True, params=[''])
def import_file(request):
    with TemporaryFile() as fp:
        fp.write(b'lol')
        yield fp


def test_import(api_client):
    url = reverse('component-import-file')
    api_client.post(url)
