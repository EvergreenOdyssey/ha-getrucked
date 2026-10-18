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
