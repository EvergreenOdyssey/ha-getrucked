"""Global fixtures for the Get-Rucked integration tests."""

from __future__ import annotations

import json
from pathlib import Path

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
