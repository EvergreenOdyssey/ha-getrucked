"""Tests for the Get-Rucked config flow."""

from __future__ import annotations

from unittest.mock import AsyncMock, patch

import pytest
from homeassistant import config_entries
from homeassistant.data_entry_flow import FlowResultType
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.getrucked import api
from custom_components.getrucked.const import CONF_TOKEN, DOMAIN

from .conftest import FAKE_TOKEN, load_fixture


async def _start_user_flow(hass):
    return await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": config_entries.SOURCE_USER}
    )


async def test_user_flow_success(hass):
    result = await _start_user_flow(hass)
    assert result["type"] is FlowResultType.FORM
    assert result["step_id"] == "user"

    with patch(
        "custom_components.getrucked.config_flow.api.async_get_stats",
        AsyncMock(return_value=load_fixture("sample_payload.json")),
    ):
        result = await hass.config_entries.flow.async_configure(
            result["flow_id"], {CONF_TOKEN: FAKE_TOKEN}
        )
        # Creating the entry schedules async_setup_entry as a background
        # task; wait for it (still under the patch, since first refresh
        # calls the same mocked api.async_get_stats) so it doesn't linger
        # past the test.
        await hass.async_block_till_done()

    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert result["data"][CONF_TOKEN] == FAKE_TOKEN
    assert result["result"].unique_id == (
        "getrucked:0000000000000000000000000000000000000000000000000000000000000000"
    )


@pytest.mark.parametrize(
    ("side_effect", "expected_error"),
    [
        (api.InvalidAuth(), "invalid_auth"),
        (api.PremiumRequired(), "premium_required"),
        (api.RateLimited(), "rate_limited"),
        (api.CannotConnect(), "cannot_connect"),
    ],
)
async def test_user_flow_errors(hass, side_effect, expected_error):
    result = await _start_user_flow(hass)

    with patch(
        "custom_components.getrucked.config_flow.api.async_get_stats",
        AsyncMock(side_effect=side_effect),
    ):
        result = await hass.config_entries.flow.async_configure(
            result["flow_id"], {CONF_TOKEN: FAKE_TOKEN}
        )

    assert result["type"] is FlowResultType.FORM
    assert result["errors"] == {"base": expected_error}


async def test_duplicate_account_aborts(hass):
    payload = load_fixture("sample_payload.json")
    entry = MockConfigEntry(
        domain=DOMAIN,
        data={CONF_TOKEN: FAKE_TOKEN},
        unique_id=payload["account_id"],
    )
    entry.add_to_hass(hass)

    result = await _start_user_flow(hass)
    with patch(
        "custom_components.getrucked.config_flow.api.async_get_stats",
        AsyncMock(return_value=payload),
    ):
        result = await hass.config_entries.flow.async_configure(
            result["flow_id"], {CONF_TOKEN: "grk_some_other_raw_token"}
        )

    assert result["type"] is FlowResultType.ABORT
    assert result["reason"] == "already_configured"


async def test_reauth_success_same_account(hass):
    payload = load_fixture("sample_payload.json")
    entry = MockConfigEntry(
        domain=DOMAIN,
        data={CONF_TOKEN: "grk_old_token"},
        unique_id=payload["account_id"],
    )
    entry.add_to_hass(hass)

    result = await entry.start_reauth_flow(hass)
    assert result["step_id"] == "reauth_confirm"

    with patch(
        "custom_components.getrucked.config_flow.api.async_get_stats",
        AsyncMock(return_value=payload),
    ):
        result = await hass.config_entries.flow.async_configure(
            result["flow_id"], {CONF_TOKEN: FAKE_TOKEN}
        )

    assert result["type"] is FlowResultType.ABORT
    assert result["reason"] == "reauth_successful"
    assert entry.data[CONF_TOKEN] == FAKE_TOKEN


async def test_reauth_account_mismatch(hass):
    payload = load_fixture("sample_payload.json")
    entry = MockConfigEntry(
        domain=DOMAIN,
        data={CONF_TOKEN: "grk_old_token"},
        unique_id="getrucked:some_other_account",
    )
    entry.add_to_hass(hass)

    result = await entry.start_reauth_flow(hass)

    with patch(
        "custom_components.getrucked.config_flow.api.async_get_stats",
        AsyncMock(return_value=payload),
    ):
        result = await hass.config_entries.flow.async_configure(
            result["flow_id"], {CONF_TOKEN: FAKE_TOKEN}
        )

    assert result["type"] is FlowResultType.FORM
    assert result["errors"] == {"base": "account_mismatch"}
    assert entry.data[CONF_TOKEN] == "grk_old_token"
