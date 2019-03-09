"""
This module is used to provide configuration, fixtures, and plugins for pytest.
"""

import pytest

from rest_framework.test import APIClient


@pytest.fixture(autouse=True, scope='function')
def media_root(settings, tmpdir_factory):
    """Forces django to save media files into temp folder."""
    settings.MEDIA_ROOT = tmpdir_factory.mktemp('media', numbered=True)


@pytest.fixture(autouse=True, scope='function')
def password_hashers(settings):
    """Forces django to use fast password hashers for tests."""
    settings.PASSWORD_HASHERS = ['django.contrib.auth.hashers.MD5PasswordHasher']


@pytest.fixture
def api_client():
    """Returns DRF api client."""
    return APIClient()
