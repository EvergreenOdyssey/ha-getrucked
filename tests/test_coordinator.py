"""Tests for the Get-Rucked DataUpdateCoordinator."""

from __future__ import annotations

from unittest.mock import AsyncMock, patch

import pytest
from homeassistant.exceptions import ConfigEntryAuthFailed
from homeassistant.helpers import issue_registry as ir
from homeassistant.helpers.update_coordinator import UpdateFailed
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.getrucked import api
from custom_components.getrucked.const import CONF_TOKEN, DOMAIN
from custom_components.getrucked.coordinator import (
    PREMIUM_ISSUE_ID,
    GetRuckedDataUpdateCoordinator,
)

from .conftest import FAKE_TOKEN, load_fixture


def _make_entry(hass) -> MockConfigEntry:
    entry = MockConfigEntry(
        domain=DOMAIN,
        data={CONF_TOKEN: FAKE_TOKEN},
        unique_id="getrucked:abc",
    )
    entry.add_to_hass(hass)
    return entry


async def test_update_success_returns_payload(hass):
    entry = _make_entry(hass)
    coordinator = GetRuckedDataUpdateCoordinator(hass, entry)
    payload = load_fixture("sample_payload.json")

    with patch(
        "custom_components.getrucked.coordinator.api.async_get_stats",
        AsyncMock(return_value=payload),
    ):
        data = await coordinator._async_update_data()

    assert data["account_id"] == payload["account_id"]


async def test_invalid_auth_raises_config_entry_auth_failed(hass):
    entry = _make_entry(hass)
    coordinator = GetRuckedDataUpdateCoordinator(hass, entry)

    with patch(
        "custom_components.getrucked.coordinator.api.async_get_stats",
        AsyncMock(side_effect=api.InvalidAuth()),
    ), pytest.raises(ConfigEntryAuthFailed):
        await coordinator._async_update_data()


async def test_premium_required_creates_then_clears_issue(hass):
    entry = _make_entry(hass)
    coordinator = GetRuckedDataUpdateCoordinator(hass, entry)
    registry = ir.async_get(hass)
    issue_id = coordinator._premium_issue_id

    with patch(
        "custom_components.getrucked.coordinator.api.async_get_stats",
        AsyncMock(side_effect=api.PremiumRequired()),
    ), pytest.raises(UpdateFailed):
        await coordinator._async_update_data()

    assert registry.async_get_issue(DOMAIN, issue_id) is not None

    with patch(
        "custom_components.getrucked.coordinator.api.async_get_stats",
        AsyncMock(return_value=load_fixture("sample_payload.json")),
    ):
        await coordinator._async_update_data()

    assert registry.async_get_issue(DOMAIN, issue_id) is None


@pytest.mark.parametrize("side_effect", [api.RateLimited(), api.CannotConnect()])
async def test_other_errors_raise_update_failed(hass, side_effect):
    entry = _make_entry(hass)
    coordinator = GetRuckedDataUpdateCoordinator(hass, entry)

    with patch(
        "custom_components.getrucked.coordinator.api.async_get_stats",
        AsyncMock(side_effect=side_effect),
    ), pytest.raises(UpdateFailed):
        await coordinator._async_update_data()
