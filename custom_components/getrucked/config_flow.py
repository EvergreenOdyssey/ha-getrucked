"""Config flow for the Get-Rucked integration."""

from __future__ import annotations

from typing import Any

import voluptuous as vol

from homeassistant.config_entries import (
    ConfigEntry,
    ConfigFlow,
    ConfigFlowResult,
    OptionsFlow,
)
from homeassistant.core import callback
from homeassistant.helpers import aiohttp_client

from . import api
from .const import (
    CONF_SCAN_INTERVAL_MINUTES,
    CONF_TOKEN,
    DATA_SEED_PAYLOADS,
    DEFAULT_SCAN_INTERVAL_MINUTES,
    DOMAIN,
    MIN_SCAN_INTERVAL_MINUTES,
)

STEP_USER_DATA_SCHEMA = vol.Schema({vol.Required(CONF_TOKEN): str})


class GetRuckedConfigFlow(ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Get-Rucked."""

    VERSION = 1

    def __init__(self) -> None:
        """Initialize the flow."""
        self._reauth_entry: ConfigEntry | None = None

    async def _async_validate_token(
        self, token: str
    ) -> tuple[dict[str, str], str | None, dict[str, Any] | None]:
        """Validate a token against the live API.

        Returns (errors, account_id, payload). account_id and payload are
        None if errors is non-empty. The payload is the full ha-stats
        response, kept so the setup that follows this flow can seed the
        coordinator with it instead of making a second request against the
        server's 60-second-per-token rate limit.
        """
        session = aiohttp_client.async_get_clientsession(self.hass)
        try:
            data = await api.async_get_stats(session, token, self.hass.config.time_zone)
        except api.InvalidAuth:
            return {"base": "invalid_auth"}, None, None
        except api.PremiumRequired:
            return {"base": "premium_required"}, None, None
        except api.RateLimited:
            return {"base": "rate_limited"}, None, None
        except api.CannotConnect:
            return {"base": "cannot_connect"}, None, None
        return {}, data.get("account_id"), data

    def _stash_seed_payload(self, account_id: str, payload: dict[str, Any]) -> None:
        self.hass.data.setdefault(DOMAIN, {}).setdefault(DATA_SEED_PAYLOADS, {})[
            account_id
        ] = payload

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Handle the initial step: the user pastes their raw token."""
        errors: dict[str, str] = {}

        if user_input is not None:
            token = user_input[CONF_TOKEN].strip()
            errors, account_id, payload = await self._async_validate_token(token)
            if not errors and account_id and payload is not None:
                await self.async_set_unique_id(account_id)
                self._abort_if_unique_id_configured()
                self._stash_seed_payload(account_id, payload)
                return self.async_create_entry(
                    title="Get-Rucked",
                    data={CONF_TOKEN: token},
                )

        return self.async_show_form(
            step_id="user", data_schema=STEP_USER_DATA_SCHEMA, errors=errors
        )

    async def async_step_reauth(
        self, entry_data: dict[str, Any]
    ) -> ConfigFlowResult:
        """Handle reauth triggered by ConfigEntryAuthFailed."""
        self._reauth_entry = self.hass.config_entries.async_get_entry(
            self.context["entry_id"]
        )
        return await self.async_step_reauth_confirm()

    async def async_step_reauth_confirm(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Handle the reauth step: validate a new token for the SAME account."""
        errors: dict[str, str] = {}

        if user_input is not None:
            assert self._reauth_entry is not None
            token = user_input[CONF_TOKEN].strip()
            errors, account_id, payload = await self._async_validate_token(token)
            if not errors and account_id and payload is not None:
                if account_id != self._reauth_entry.unique_id:
                    errors = {"base": "account_mismatch"}
                else:
                    self._stash_seed_payload(account_id, payload)
                    self.hass.config_entries.async_update_entry(
                        self._reauth_entry,
                        data={**self._reauth_entry.data, CONF_TOKEN: token},
                    )
                    await self.hass.config_entries.async_reload(
                        self._reauth_entry.entry_id
                    )
                    return self.async_abort(reason="reauth_successful")

        return self.async_show_form(
            step_id="reauth_confirm", data_schema=STEP_USER_DATA_SCHEMA, errors=errors
        )

    @staticmethod
    @callback
    def async_get_options_flow(config_entry: ConfigEntry) -> OptionsFlow:
        """Get the options flow for this handler."""
        return GetRuckedOptionsFlow()


class GetRuckedOptionsFlow(OptionsFlow):
    """Options flow: just the poll interval."""

    async def async_step_init(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Manage the poll interval option."""
        if user_input is not None:
            return self.async_create_entry(data=user_input)

        current = self.config_entry.options.get(
            CONF_SCAN_INTERVAL_MINUTES, DEFAULT_SCAN_INTERVAL_MINUTES
        )
        return self.async_show_form(
            step_id="init",
            data_schema=vol.Schema(
                {
                    vol.Required(
                        CONF_SCAN_INTERVAL_MINUTES, default=current
                    ): vol.All(vol.Coerce(int), vol.Range(min=MIN_SCAN_INTERVAL_MINUTES))
                }
            ),
        )
