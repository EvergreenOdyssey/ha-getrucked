"""Diagnostics support for the Get-Rucked integration."""

from __future__ import annotations

from typing import Any

from homeassistant.components.diagnostics import async_redact_data
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .const import CONF_TOKEN
from .coordinator import GetRuckedDataUpdateCoordinator

# The token is the only secret here. account_id is a one-way hash of the
# user's own uuid, not a credential, and is left visible since it's the
# whole point of a diagnostics dump to be able to match it up with support.
TO_REDACT = {CONF_TOKEN}


async def async_get_config_entry_diagnostics(
    hass: HomeAssistant, entry: ConfigEntry
) -> dict[str, Any]:
    """Return diagnostics for a config entry."""
    coordinator: GetRuckedDataUpdateCoordinator = entry.runtime_data
    return {
        "entry_data": async_redact_data(dict(entry.data), TO_REDACT),
        "options": dict(entry.options),
        "data": coordinator.data,
    }
