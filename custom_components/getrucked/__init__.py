"""The Get-Rucked integration."""

from __future__ import annotations

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant
from homeassistant.helpers.typing import ConfigType

from .const import DATA_SEED_PAYLOADS, DOMAIN
from .coordinator import GetRuckedDataUpdateCoordinator
from .frontend import async_register_frontend

PLATFORMS: list[Platform] = [Platform.SENSOR]

type GetRuckedConfigEntry = ConfigEntry[GetRuckedDataUpdateCoordinator]


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Serve and register the dashboard card once, regardless of how many
    accounts (config entries) get added."""
    await async_register_frontend(hass)
    return True


async def async_setup_entry(hass: HomeAssistant, entry: GetRuckedConfigEntry) -> bool:
    """Set up Get-Rucked from a config entry."""
    coordinator = GetRuckedDataUpdateCoordinator(hass, entry)

    # If this setup is running right after the config flow validated this
    # same account (initial setup or reauth), seed the coordinator from
    # that response instead of making a second request -- the server only
    # allows one request per token per 60 seconds.
    seed_store = hass.data.setdefault(DOMAIN, {}).setdefault(DATA_SEED_PAYLOADS, {})
    seed_payload = seed_store.pop(entry.unique_id, None) if entry.unique_id else None
    if seed_payload is not None:
        coordinator.async_set_updated_data(seed_payload)
    else:
        await coordinator.async_config_entry_first_refresh()

    entry.runtime_data = coordinator
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    entry.async_on_unload(entry.add_update_listener(_async_update_listener))
    return True


async def async_unload_entry(hass: HomeAssistant, entry: GetRuckedConfigEntry) -> bool:
    """Unload a config entry."""
    return await hass.config_entries.async_unload_platforms(entry, PLATFORMS)


async def _async_update_listener(
    hass: HomeAssistant, entry: GetRuckedConfigEntry
) -> None:
    """Reload the entry when its options (poll interval) change."""
    await hass.config_entries.async_reload(entry.entry_id)
