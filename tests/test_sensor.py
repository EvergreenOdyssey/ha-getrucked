"""Tests for Get-Rucked sensors."""

from __future__ import annotations

from unittest.mock import AsyncMock, patch

from homeassistant.helpers import entity_registry as er
from homeassistant.util.unit_system import US_CUSTOMARY_SYSTEM
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.getrucked.const import CONF_TOKEN, DOMAIN

from .conftest import FAKE_TOKEN, load_fixture


async def _setup_entry(hass, payload) -> MockConfigEntry:
    # device_class=DISTANCE sensors have their displayed state auto-converted
    # to HA's configured unit system. The fixtures are in miles, so pin the
    # test instance to imperial — otherwise these assertions would really be
    # testing HA's own mi<->km conversion math, not our field mapping.
    hass.config.units = US_CUSTOMARY_SYSTEM

    entry = MockConfigEntry(
        domain=DOMAIN,
        data={CONF_TOKEN: FAKE_TOKEN},
        unique_id=payload["account_id"],
    )
    entry.add_to_hass(hass)

    with patch(
        "custom_components.getrucked.coordinator.api.async_get_stats",
        AsyncMock(return_value=payload),
    ):
        assert await hass.config_entries.async_setup(entry.entry_id)
        await hass.async_block_till_done()
    return entry


def _state_for_unique_id(hass, unique_id: str):
    registry = er.async_get(hass)
    entity_id = registry.async_get_entity_id("sensor", DOMAIN, unique_id)
    assert entity_id is not None, f"no entity registered for unique_id {unique_id!r}"
    state = hass.states.get(entity_id)
    assert state is not None, f"entity {entity_id} has no state"
    return state


async def test_static_sensors_match_payload(hass):
    payload = load_fixture("sample_payload.json")
    entry = await _setup_entry(hass, payload)
    account_id = payload["account_id"]

    weekly = _state_for_unique_id(hass, f"{account_id}_weekly_distance")
    assert weekly.state == str(payload["weekly"]["total_distance"])
    assert weekly.attributes["session_count"] == payload["weekly"]["session_count"]
    assert weekly.attributes["training_load"] == payload["weekly"]["training_load"]

    monthly = _state_for_unique_id(hass, f"{account_id}_monthly_distance")
    assert monthly.state == str(payload["monthly"]["total_distance"])

    latest = _state_for_unique_id(hass, f"{account_id}_latest_ruck_distance")
    assert latest.state == str(payload["latest_ruck"]["distance"])
    assert latest.attributes["terrain"] == payload["latest_ruck"]["terrain"]
    assert latest.attributes["calc_version"] == payload["calc_version"]

    ctl = _state_for_unique_id(hass, f"{account_id}_fitness_ctl")
    assert ctl.state == str(payload["training_load"]["fitness_ctl"])

    tsb = _state_for_unique_id(hass, f"{account_id}_form_tsb")
    assert tsb.state == str(payload["training_load"]["form_tsb"])
    assert tsb.attributes["label"] == payload["training_load"]["form_label"]

    rank = _state_for_unique_id(hass, f"{account_id}_rank")
    assert rank.state == payload["rank"]["name"]
    assert rank.attributes["total_miles"] == payload["rank"]["total_miles"]
    assert rank.attributes["icon_emoji"] == payload["rank"]["icon"]

    distance_next = _state_for_unique_id(hass, f"{account_id}_distance_to_next_rank")
    assert distance_next.state == str(payload["rank"]["miles_to_next"])
    assert distance_next.attributes["unit_of_measurement"] == "mi"

    assert entry is not None


async def test_promoted_latest_ruck_sensors(hass):
    """duration/pace/pack weight/elevation gain/calories/steps/weather
    temp/avg heart rate get their own sensors (for history graphs), and
    are no longer duplicated as Latest Ruck Distance attributes."""
    payload = load_fixture("sample_payload.json")
    await _setup_entry(hass, payload)
    account_id = payload["account_id"]
    ruck = payload["latest_ruck"]

    duration = _state_for_unique_id(hass, f"{account_id}_latest_ruck_duration")
    assert duration.state == str(ruck["duration_minutes"])

    pace = _state_for_unique_id(hass, f"{account_id}_latest_ruck_pace")
    assert pace.state == ruck["pace"]
    assert pace.attributes["unit"] == ruck["pace_unit"]

    weight = _state_for_unique_id(hass, f"{account_id}_latest_ruck_pack_weight")
    assert weight.state == str(ruck["weight"])
    assert weight.attributes["unit_of_measurement"] == "lb"

    elevation = _state_for_unique_id(hass, f"{account_id}_latest_ruck_elevation_gain")
    assert elevation.state == str(ruck["elevation_gain"])
    assert elevation.attributes["unit_of_measurement"] == "ft"

    calories = _state_for_unique_id(hass, f"{account_id}_latest_ruck_calories")
    assert calories.state == str(ruck["calories_burned"])

    steps = _state_for_unique_id(hass, f"{account_id}_latest_ruck_steps")
    assert steps.state == str(ruck["steps"])

    weather = _state_for_unique_id(hass, f"{account_id}_latest_ruck_weather_temp")
    assert weather.state == str(ruck["weather_temp"])
    assert weather.attributes["condition"] == ruck["weather_condition"]

    heart_rate = _state_for_unique_id(hass, f"{account_id}_latest_ruck_heart_rate_avg")
    assert heart_rate.state == str(ruck["heart_rate_avg"])
    assert heart_rate.attributes["max"] == ruck["heart_rate_max"]

    # These fields moved off Latest Ruck Distance's attributes once promoted.
    latest = _state_for_unique_id(hass, f"{account_id}_latest_ruck_distance")
    for removed in ("duration_minutes", "pace", "weight", "elevation_gain", "calories_burned", "steps", "weather_temp", "heart_rate_avg"):
        assert removed not in latest.attributes


async def test_pack_weight_sensor_null_when_no_weight_logged(hass):
    """A ruck with no logged weight (a real, common state) must not crash
    the sensor -- it reports unknown rather than a fake "No pack" string,
    which is a card-level display choice, not a sensor-level one."""
    payload = load_fixture("sample_payload.json")
    payload["latest_ruck"]["weight"] = None
    await _setup_entry(hass, payload)
    account_id = payload["account_id"]

    weight = _state_for_unique_id(hass, f"{account_id}_latest_ruck_pack_weight")
    assert weight.state == "unknown"


async def test_goal_sensors_created_for_each_goal(hass):
    payload = load_fixture("sample_payload.json")
    account_id = payload["account_id"]
    await _setup_entry(hass, payload)

    for goal in payload["goals"]:
        state = _state_for_unique_id(hass, f"{account_id}_goal_{goal['id']}")
        assert state.state == str(goal["percent_complete"])
        assert state.attributes["title"] == goal["title"]
        assert state.attributes["target_value"] == goal["target_value"]


async def test_goal_entity_removed_when_goal_disappears(hass):
    payload = load_fixture("sample_payload.json")
    account_id = payload["account_id"]
    entry = await _setup_entry(hass, payload)

    removed_goal_id = payload["goals"][1]["id"]
    removed_unique_id = f"{account_id}_goal_{removed_goal_id}"
    registry = er.async_get(hass)
    assert registry.async_get_entity_id("sensor", DOMAIN, removed_unique_id) is not None

    one_goal_payload = load_fixture("sample_payload_one_goal.json")
    coordinator = entry.runtime_data
    with patch(
        "custom_components.getrucked.coordinator.api.async_get_stats",
        AsyncMock(return_value=one_goal_payload),
    ):
        await coordinator.async_refresh()
        await hass.async_block_till_done()

    assert registry.async_get_entity_id("sensor", DOMAIN, removed_unique_id) is None

    remaining_goal_id = one_goal_payload["goals"][0]["id"]
    remaining = _state_for_unique_id(hass, f"{account_id}_goal_{remaining_goal_id}")
    assert remaining.state == str(one_goal_payload["goals"][0]["percent_complete"])
