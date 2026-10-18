"""DataUpdateCoordinator for the Get-Rucked integration."""

from __future__ import annotations

import logging
from datetime import timedelta
from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ConfigEntryAuthFailed
from homeassistant.helpers import aiohttp_client, issue_registry as ir
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed

from . import api
from .const import CONF_SCAN_INTERVAL_MINUTES, CONF_TOKEN, DEFAULT_SCAN_INTERVAL_MINUTES, DOMAIN

_LOGGER = logging.getLogger(__name__)

PREMIUM_ISSUE_ID = "premium_required"


class GetRuckedDataUpdateCoordinator(DataUpdateCoordinator[dict[str, Any]]):
    """Fetches Get-Rucked stats from ha-stats on a timer."""

    def __init__(self, hass: HomeAssistant, entry: ConfigEntry) -> None:
        """Initialize the coordinator."""
        interval_minutes = entry.options.get(
            CONF_SCAN_INTERVAL_MINUTES, DEFAULT_SCAN_INTERVAL_MINUTES
        )
        super().__init__(
            hass,
            _LOGGER,
            name=DOMAIN,
            update_interval=timedelta(minutes=interval_minutes),
        )
        self.entry = entry
        self._session = aiohttp_client.async_get_clientsession(hass)

    @property
    def _premium_issue_id(self) -> str:
        return f"{self.entry.entry_id}_{PREMIUM_ISSUE_ID}"

    async def _async_update_data(self) -> dict[str, Any]:
        """Fetch the latest stats, translating API errors into HA semantics."""
        token = self.entry.data[CONF_TOKEN]

        try:
            data = await api.async_get_stats(
                self._session, token, self.hass.config.time_zone
            )
        except api.InvalidAuth as err:
            # HA will surface this as a reauth flow on this entry.
            raise ConfigEntryAuthFailed(
                "Get-Rucked token is invalid or has been revoked"
            ) from err
        except api.PremiumRequired as err:
            ir.async_create_issue(
                self.hass,
                DOMAIN,
                self._premium_issue_id,
                is_fixable=False,
                severity=ir.IssueSeverity.WARNING,
                translation_key=PREMIUM_ISSUE_ID,
            )
            raise UpdateFailed("Get-Rucked Premium is required") from err
        except api.RateLimited as err:
            raise UpdateFailed("Rate limited by the Get-Rucked API") from err
        except api.CannotConnect as err:
            raise UpdateFailed("Could not reach the Get-Rucked API") from err

        # Reaching here means the account is in good standing again — clear
        # any stale "Premium required" repair issue. No-op if none exists.
        ir.async_delete_issue(self.hass, DOMAIN, self._premium_issue_id)
        return data
