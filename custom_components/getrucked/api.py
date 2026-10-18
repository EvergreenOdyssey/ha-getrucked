"""Thin async client for the Get-Rucked ha-stats API."""

from __future__ import annotations

import asyncio
from typing import Any

import aiohttp

from .const import API_URL

REQUEST_TIMEOUT_SECONDS = 15


class GetRuckedApiError(Exception):
    """Base error talking to the Get-Rucked API."""


class InvalidAuth(GetRuckedApiError):
    """The token is invalid or has been revoked (HTTP 401)."""


class PremiumRequired(GetRuckedApiError):
    """The account does not have an active Premium subscription (HTTP 402)."""


class RateLimited(GetRuckedApiError):
    """The server's per-token rate limit was hit (HTTP 429)."""

    def __init__(self, retry_after: int | None = None) -> None:
        super().__init__("rate limited")
        self.retry_after = retry_after


class CannotConnect(GetRuckedApiError):
    """Could not reach the API, or it returned something unexpected."""


async def async_get_stats(
    session: aiohttp.ClientSession, token: str, time_zone: str
) -> dict[str, Any]:
    """Call ha-stats and return the parsed JSON payload, or raise on error."""
    headers = {"Authorization": f"Bearer {token}"}
    params = {"tz": time_zone}

    try:
        async with asyncio.timeout(REQUEST_TIMEOUT_SECONDS):
            resp = await session.get(API_URL, headers=headers, params=params)
            if resp.status == 200:
                return await resp.json()
            retry_after_header = resp.headers.get("Retry-After")
    except (aiohttp.ClientError, asyncio.TimeoutError) as err:
        raise CannotConnect from err

    if resp.status == 401:
        raise InvalidAuth
    if resp.status == 402:
        raise PremiumRequired
    if resp.status == 429:
        raise RateLimited(int(retry_after_header) if retry_after_header else None)

    raise CannotConnect(f"unexpected status {resp.status}")
