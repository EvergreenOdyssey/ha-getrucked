"""Serves the bundled Get-Rucked Lovelace card and registers it with HA.

Static path + add_extra_js_url is what makes the card's JS load for every
user automatically -- no manual dashboard resource for anyone. Auto-creating
(and, critically, auto-UPDATING) a storage-mode Lovelace resource entry is
what additionally makes the card appear in the "Add Card" picker, not just
work when hand-typed as YAML.
"""

from __future__ import annotations

import json
import logging
from pathlib import Path

from homeassistant.components import frontend
from homeassistant.components.http import StaticPathConfig
from homeassistant.core import HomeAssistant

_LOGGER = logging.getLogger(__name__)

URL_BASE = "/getrucked-static"
CARD_FILENAME = "getrucked-card.js"
WWW_PATH = Path(__file__).parent / "www"

_MANIFEST = json.loads((Path(__file__).parent / "manifest.json").read_text())
INTEGRATION_VERSION: str = _MANIFEST["version"]


def _card_url(version: str) -> str:
    # The ?v= query string busts browser/companion-app caching of the
    # bundle on every integration update.
    return f"{URL_BASE}/{CARD_FILENAME}?v={version}"


async def async_register_frontend(
    hass: HomeAssistant, version: str = INTEGRATION_VERSION
) -> None:
    """Serve custom_components/getrucked/www/ and make HA load the card."""
    try:
        await hass.http.async_register_static_paths(
            [StaticPathConfig(URL_BASE, str(WWW_PATH), False)]
        )
    except RuntimeError:
        # Already registered -- a second config entry's setup, or a reload.
        pass

    card_url = _card_url(version)
    frontend.add_extra_js_url(hass, card_url)

    await _async_sync_lovelace_resource(hass, card_url)


async def _async_sync_lovelace_resource(hass: HomeAssistant, card_url: str) -> None:
    """Create, or update, the storage-mode Lovelace resource for the card.

    Finding our own prior entry by its path (ignoring the ?v= query string)
    and updating its url in place -- rather than skipping registration just
    because *a* resource at that path already exists -- is what keeps users
    from being stuck on a stale cached card bundle after an update.

    No-ops for YAML-mode dashboards (the resource has to be hand-added
    there; see the README) and for the Marketplace vs. legacy HACS
    differences this session couldn't fully verify without a live instance.
    """
    lovelace = hass.data.get("lovelace")
    if lovelace is None:
        return
    resources = getattr(lovelace, "resources", None)
    if resources is None:
        return
    if getattr(lovelace, "mode", None) != "storage":
        return

    if not resources.loaded:
        await resources.async_load()
        resources.loaded = True

    card_path = card_url.split("?", 1)[0]
    existing = next(
        (
            item
            for item in resources.async_items()
            if item.get("url", "").split("?", 1)[0] == card_path
        ),
        None,
    )

    if existing is None:
        await resources.async_create_item({"res_type": "module", "url": card_url})
    elif existing["url"] != card_url:
        await resources.async_update_item(
            existing["id"], {"res_type": "module", "url": card_url}
        )
