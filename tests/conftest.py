"""Global fixtures for the Get-Rucked integration tests."""

from __future__ import annotations

import json
from pathlib import Path
from unittest.mock import MagicMock, patch

import pytest

pytest_plugins = "pytest_homeassistant_custom_component"

FIXTURES_DIR = Path(__file__).parent / "fixtures"
FAKE_TOKEN = "grk_test_do_not_use_0000000000000000000000000000000000"


def load_fixture(name: str) -> dict:
    """Load and parse a JSON fixture file by name."""
    return json.loads((FIXTURES_DIR / name).read_text())


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(enable_custom_integrations):
    """Enable custom integrations for every test in this suite."""
    yield


@pytest.fixture(autouse=True)
def mock_aiohttp_session():
    """Never construct a real aiohttp ClientSession in tests.

    api.async_get_stats is always mocked, so the session object itself is
    never used for real I/O -- but a real session's connector can leave a
    background thread running past test teardown (aiohttp's safe-shutdown
    machinery), which trips the harness's "no lingering threads" check.
    """
    with patch(
        "homeassistant.helpers.aiohttp_client.async_get_clientsession",
        return_value=MagicMock(),
    ):
        yield
