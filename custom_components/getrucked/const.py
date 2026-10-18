"""Constants for the Get-Rucked integration."""

from __future__ import annotations

DOMAIN = "getrucked"

# There is only one backend; the endpoint is not user-configurable.
API_URL = "https://wisftixjjakjrrauqmlr.supabase.co/functions/v1/ha-stats"

CONF_TOKEN = "token"
CONF_SCAN_INTERVAL_MINUTES = "scan_interval_minutes"

DEFAULT_SCAN_INTERVAL_MINUTES = 15
# The server rate-limits a token to one request per 60 seconds; this floor
# keeps the coordinator comfortably above that.
MIN_SCAN_INTERVAL_MINUTES = 15
# Server-side rate limit window, in seconds. Used as a fallback delay if a
# 429 response doesn't include a Retry-After header.
RATE_LIMIT_FALLBACK_SECONDS = 60

# hass.data[DOMAIN][DATA_SEED_PAYLOADS] stashes a just-validated ha-stats
# response, keyed by account_id, so the setup that immediately follows a
# config flow (initial create, or reauth) can seed the coordinator instead
# of making a second request inside the server's 60s rate-limit window.
DATA_SEED_PAYLOADS = "seed_payloads"
