from tempfile import TemporaryFile

import pytest


@pytest.fixture(scope='module', autouse=True, params=[''])
def import_file(request):
    with TemporaryFile() as fp:
        fp.write(b'lol')
        yield fp


def test_import(import_file):
    __import__('pdb').set_trace()
