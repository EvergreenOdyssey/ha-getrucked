"""Sensor platform for the Get-Rucked integration."""

from __future__ import annotations

from collections.abc import Callable
from dataclasses import dataclass
from typing import Any

from homeassistant.components.sensor import (
    SensorDeviceClass,
    SensorEntity,
    SensorEntityDescription,
    SensorStateClass,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import PERCENTAGE, UnitOfLength
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.entity import DeviceInfo
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .const import DOMAIN
from .coordinator import GetRuckedDataUpdateCoordinator

_DISTANCE_UNIT = {"mi": UnitOfLength.MILES, "km": UnitOfLength.KILOMETERS}


def _device_info(entry: ConfigEntry) -> DeviceInfo:
    return DeviceInfo(
        identifiers={(DOMAIN, entry.unique_id or entry.entry_id)},
        name="Get-Rucked",
        manufacturer="Evergreen Odyssey",
        entry_type="service",
    )


def _latest_ruck(data: dict[str, Any]) -> dict[str, Any]:
    return data.get("latest_ruck") or {}


def _period(data: dict[str, Any], key: str) -> dict[str, Any]:
    return data.get(key) or {}


def _training_load(data: dict[str, Any]) -> dict[str, Any]:
    return data.get("training_load") or {}


def _rank(data: dict[str, Any]) -> dict[str, Any]:
    return data.get("rank") or {}


@dataclass(frozen=True, kw_only=True)
class GetRuckedSensorDescription(SensorEntityDescription):
    """Describes a static Get-Rucked sensor."""

    value_fn: Callable[[dict[str, Any]], Any]
    attrs_fn: Callable[[dict[str, Any]], dict[str, Any] | None] | None = None
    unit_fn: Callable[[dict[str, Any]], str | None] | None = None


SENSORS: tuple[GetRuckedSensorDescription, ...] = (
    GetRuckedSensorDescription(
        key="latest_ruck_distance",
        translation_key="latest_ruck_distance",
        device_class=SensorDeviceClass.DISTANCE,
        state_class=SensorStateClass.MEASUREMENT,
        value_fn=lambda d: _latest_ruck(d).get("distance"),
        unit_fn=lambda d: _DISTANCE_UNIT.get(_latest_ruck(d).get("distance_unit")),
        attrs_fn=lambda d: {
            "date": _latest_ruck(d).get("date"),
            "type": _latest_ruck(d).get("type"),
            "duration_minutes": _latest_ruck(d).get("duration_minutes"),
            "pace": _latest_ruck(d).get("pace"),
            "pace_unit": _latest_ruck(d).get("pace_unit"),
            "weight": _latest_ruck(d).get("weight"),
            "weight_unit": _latest_ruck(d).get("weight_unit"),
            "elevation_gain": _latest_ruck(d).get("elevation_gain"),
            "elevation_loss": _latest_ruck(d).get("elevation_loss"),
            "elevation_unit": _latest_ruck(d).get("elevation_unit"),
            "steps": _latest_ruck(d).get("steps"),
            "calories_burned": _latest_ruck(d).get("calories_burned"),
            "avg_cadence": _latest_ruck(d).get("avg_cadence"),
            "terrain": _latest_ruck(d).get("terrain"),
            "rating": _latest_ruck(d).get("rating"),
            "calc_version": d.get("calc_version"),
        },
    ),
    GetRuckedSensorDescription(
        key="weekly_distance",
        translation_key="weekly_distance",
        device_class=SensorDeviceClass.DISTANCE,
        state_class=SensorStateClass.MEASUREMENT,
        value_fn=lambda d: _period(d, "weekly").get("total_distance"),
        unit_fn=lambda d: _DISTANCE_UNIT.get(_period(d, "weekly").get("distance_unit")),
        attrs_fn=lambda d: {
            "session_count": _period(d, "weekly").get("session_count"),
            "total_minutes": _period(d, "weekly").get("total_minutes"),
            "elevation_gain": _period(d, "weekly").get("elevation_gain"),
            "elevation_unit": _period(d, "weekly").get("elevation_unit"),
            "calories": _period(d, "weekly").get("calories"),
            "training_load": _period(d, "weekly").get("training_load"),
        },
    ),
    GetRuckedSensorDescription(
        key="monthly_distance",
        translation_key="monthly_distance",
        device_class=SensorDeviceClass.DISTANCE,
        state_class=SensorStateClass.MEASUREMENT,
        value_fn=lambda d: _period(d, "monthly").get("total_distance"),
        unit_fn=lambda d: _DISTANCE_UNIT.get(_period(d, "monthly").get("distance_unit")),
        attrs_fn=lambda d: {
            "session_count": _period(d, "monthly").get("session_count"),
            "total_minutes": _period(d, "monthly").get("total_minutes"),
            "elevation_gain": _period(d, "monthly").get("elevation_gain"),
            "elevation_unit": _period(d, "monthly").get("elevation_unit"),
            "calories": _period(d, "monthly").get("calories"),
            "training_load": _period(d, "monthly").get("training_load"),
        },
    ),
    GetRuckedSensorDescription(
        key="fitness_ctl",
        translation_key="fitness_ctl",
        state_class=SensorStateClass.MEASUREMENT,
        value_fn=lambda d: _training_load(d).get("fitness_ctl"),
    ),
    GetRuckedSensorDescription(
        key="fatigue_atl",
        translation_key="fatigue_atl",
        state_class=SensorStateClass.MEASUREMENT,
        value_fn=lambda d: _training_load(d).get("fatigue_atl"),
    ),
    GetRuckedSensorDescription(
        key="form_tsb",
        translation_key="form_tsb",
        state_class=SensorStateClass.MEASUREMENT,
        value_fn=lambda d: _training_load(d).get("form_tsb"),
        attrs_fn=lambda d: {"label": _training_load(d).get("form_label")},
    ),
    GetRuckedSensorDescription(
        key="rank",
        translation_key="rank",
        value_fn=lambda d: _rank(d).get("name"),
        attrs_fn=lambda d: {
            "icon_emoji": _rank(d).get("icon"),
            # Rank thresholds are defined in miles server-side regardless of
            # the account's unit preference, so this is always miles.
            "total_miles": _rank(d).get("total_miles"),
            "next_rank_name": _rank(d).get("next_rank_name"),
        },
    ),
    GetRuckedSensorDescription(
        key="distance_to_next_rank",
        translation_key="distance_to_next_rank",
        device_class=SensorDeviceClass.DISTANCE,
        state_class=SensorStateClass.MEASUREMENT,
        # Always miles — see the note on the rank sensor above. HA's own
        # unit system will convert this for display if the user runs HA
        # in metric.
        native_unit_of_measurement=UnitOfLength.MILES,
        value_fn=lambda d: _rank(d).get("miles_to_next"),
    ),
)


async def async_setup_entry(
    hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddEntitiesCallback
) -> None:
    """Set up Get-Rucked sensors: the static set plus one per active goal."""
    coordinator: GetRuckedDataUpdateCoordinator = entry.runtime_data

    async_add_entities(
        GetRuckedSensor(coordinator, entry, description) for description in SENSORS
    )

    known_goal_ids: set[Any] = set()

    @callback
    def _sync_goal_entities() -> None:
        data = coordinator.data or {}
        current_ids = {g["id"] for g in data.get("goals", []) if "id" in g}

        new_ids = current_ids - known_goal_ids
        if new_ids:
            async_add_entities(
                GetRuckedGoalSensor(coordinator, entry, goal_id) for goal_id in new_ids
            )
            known_goal_ids.update(new_ids)

        removed_ids = known_goal_ids - current_ids
        if removed_ids:
            registry = er.async_get(hass)
            for goal_id in removed_ids:
                unique_id = f"{entry.unique_id}_goal_{goal_id}"
                entity_id = registry.async_get_entity_id("sensor", DOMAIN, unique_id)
                if entity_id:
                    registry.async_remove(entity_id)
            known_goal_ids.difference_update(removed_ids)

    _sync_goal_entities()
    entry.async_on_unload(coordinator.async_add_listener(_sync_goal_entities))


class GetRuckedSensor(
    CoordinatorEntity[GetRuckedDataUpdateCoordinator], SensorEntity
):
    """A static Get-Rucked sensor driven by a GetRuckedSensorDescription."""

    _attr_has_entity_name = True
    entity_description: GetRuckedSensorDescription

    def __init__(
        self,
        coordinator: GetRuckedDataUpdateCoordinator,
        entry: ConfigEntry,
        description: GetRuckedSensorDescription,
    ) -> None:
        super().__init__(coordinator)
        self.entity_description = description
        self._attr_unique_id = f"{entry.unique_id}_{description.key}"
        self._attr_device_info = _device_info(entry)

    @property
    def native_value(self) -> Any:
        if self.coordinator.data is None:
            return None
        return self.entity_description.value_fn(self.coordinator.data)

    @property
    def native_unit_of_measurement(self) -> str | None:
        if self.entity_description.unit_fn is None:
            return self.entity_description.native_unit_of_measurement
        if self.coordinator.data is None:
            return None
        return self.entity_description.unit_fn(self.coordinator.data)

    @property
    def extra_state_attributes(self) -> dict[str, Any] | None:
        if self.entity_description.attrs_fn is None or self.coordinator.data is None:
            return None
        return self.entity_description.attrs_fn(self.coordinator.data)


class GetRuckedGoalSensor(
    CoordinatorEntity[GetRuckedDataUpdateCoordinator], SensorEntity
):
    """One sensor per active Get-Rucked goal, keyed by the goal's stable id."""

    _attr_has_entity_name = True
    _attr_translation_key = "goal_percent"
    _attr_native_unit_of_measurement = PERCENTAGE
    _attr_state_class = SensorStateClass.MEASUREMENT

    def __init__(
        self,
        coordinator: GetRuckedDataUpdateCoordinator,
        entry: ConfigEntry,
        goal_id: Any,
    ) -> None:
        super().__init__(coordinator)
        self._goal_id = goal_id
        self._attr_unique_id = f"{entry.unique_id}_goal_{goal_id}"
        self._attr_device_info = _device_info(entry)
        self._update_translation_placeholders()

    def _goal(self) -> dict[str, Any]:
        for goal in (self.coordinator.data or {}).get("goals", []):
            if goal.get("id") == self._goal_id:
                return goal
        return {}

    def _update_translation_placeholders(self) -> None:
        self._attr_translation_placeholders = {"title": self._goal().get("title", "")}

    @callback
    def _handle_coordinator_update(self) -> None:
        self._update_translation_placeholders()
        super()._handle_coordinator_update()

    @property
    def available(self) -> bool:
        return super().available and bool(self._goal())

    @property
    def native_value(self) -> Any:
        return self._goal().get("percent_complete")

    @property
    def extra_state_attributes(self) -> dict[str, Any] | None:
        goal = self._goal()
        if not goal:
            return None
        return {
            "title": goal.get("title"),
            "type": goal.get("type"),
            "current_value": goal.get("current_value"),
            "target_value": goal.get("target_value"),
            "unit": goal.get("unit"),
            "period": goal.get("period"),
        }
