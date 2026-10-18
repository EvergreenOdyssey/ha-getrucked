// Minimal local types for the slice of Home Assistant's frontend `hass`
// object this card actually uses. Intentionally hand-rolled (not pulling in
// a types package) to keep the bundle dependency-free beyond lit.

export interface HassEntityState {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
  last_changed?: string;
  last_updated?: string;
}

export interface EntityRegistryDisplayEntry {
  entity_id: string;
  device_id?: string | null;
  platform?: string;
  translation_key?: string | null;
  unique_id?: string;
}

export interface DeviceRegistryEntry {
  id: string;
  name?: string | null;
  name_by_user?: string | null;
  config_entries?: string[];
}

export interface IssueRegistryItem {
  issue_id: string;
  domain: string;
}

export interface HomeAssistant {
  states: Record<string, HassEntityState>;
  entities: Record<string, EntityRegistryDisplayEntry>;
  devices: Record<string, DeviceRegistryEntry>;
  // Populated by HA's repairs/issues subscription where available. Not
  // every hass context provides this (e.g. it's absent in some embedded
  // previews) -- treat it as optional and fall back gracefully.
  issues?: Record<string, IssueRegistryItem>;
  themes?: { darkMode?: boolean };
  language?: string;
  callService?: (
    domain: string,
    service: string,
    data?: Record<string, unknown>,
  ) => Promise<unknown>;
}
