"""Tests for the Lovelace resource create-or-update logic.

Uses fake lovelace/resources objects rather than HA's real lovelace
integration -- these tests are specifically about our own
create-vs-update decision, not about lovelace storage itself.
"""

from __future__ import annotations

from custom_components.getrucked.frontend import _async_sync_lovelace_resource


class FakeResources:
    def __init__(self, items=None, loaded=True):
        self._items = list(items or [])
        self.loaded = loaded
        self.create_calls = []
        self.update_calls = []
        self._next_id = 100

    def async_items(self):
        return list(self._items)

    async def async_load(self):
        self.loaded = True

    async def async_create_item(self, data):
        self._next_id += 1
        item = {"id": str(self._next_id), **data}
        self._items.append(item)
        self.create_calls.append(data)
        return item

    async def async_update_item(self, item_id, data):
        for item in self._items:
            if item["id"] == item_id:
                item.update(data)
        self.update_calls.append((item_id, data))


class FakeLovelace:
    def __init__(self, mode="storage", resources=None):
        self.mode = mode
        self.resources = resources


OLD_URL = "/getrucked-static/getrucked-card.js?v=0.1.0"
NEW_URL = "/getrucked-static/getrucked-card.js?v=0.2.0"


async def test_creates_resource_when_none_exists(hass):
    resources = FakeResources(items=[])
    hass.data["lovelace"] = FakeLovelace(resources=resources)

    await _async_sync_lovelace_resource(hass, NEW_URL)

    assert len(resources.create_calls) == 1
    assert resources.create_calls[0] == {"res_type": "module", "url": NEW_URL}
    assert not resources.update_calls


async def test_updates_existing_resource_to_new_version(hass):
    """The core requirement: an integration update must UPDATE the
    existing resource's url, not skip registration just because a
    resource at that path already exists -- otherwise users are stuck on
    a stale cached bundle."""
    resources = FakeResources(items=[{"id": "1", "res_type": "module", "url": OLD_URL}])
    hass.data["lovelace"] = FakeLovelace(resources=resources)

    await _async_sync_lovelace_resource(hass, NEW_URL)

    assert not resources.create_calls
    assert resources.update_calls == [("1", {"res_type": "module", "url": NEW_URL})]
    assert resources.async_items()[0]["url"] == NEW_URL


async def test_skips_when_url_already_current(hass):
    resources = FakeResources(items=[{"id": "1", "res_type": "module", "url": NEW_URL}])
    hass.data["lovelace"] = FakeLovelace(resources=resources)

    await _async_sync_lovelace_resource(hass, NEW_URL)

    assert not resources.create_calls
    assert not resources.update_calls


async def test_noop_in_yaml_mode(hass):
    resources = FakeResources(items=[])
    hass.data["lovelace"] = FakeLovelace(mode="yaml", resources=resources)

    await _async_sync_lovelace_resource(hass, NEW_URL)

    assert not resources.create_calls
    assert not resources.update_calls


async def test_noop_when_lovelace_not_loaded(hass):
    # hass.data has no "lovelace" key at all -- must not raise.
    await _async_sync_lovelace_resource(hass, NEW_URL)


async def test_loads_resources_if_not_loaded_yet(hass):
    resources = FakeResources(items=[], loaded=False)
    hass.data["lovelace"] = FakeLovelace(resources=resources)

    await _async_sync_lovelace_resource(hass, NEW_URL)

    assert resources.loaded is True
    assert len(resources.create_calls) == 1
