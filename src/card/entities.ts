// Entity discovery: everything here resolves entities via the entity
// registry's translation_key, never a hardcoded entity_id -- so the card
// works for any user's device, regardless of how HA slugified their
// entity_ids.
import type { HassEntityState, HomeAssistant } from "./hass-types";
import { PLATFORM } from "./const";

const NO_VALUE_STATES = new Set(["unknown", "unavailable", ""]);

export interface DeviceOption {
  id: string;
  name: string;
}

/** Devices on the getrucked platform, for the editor's device picker. */
export function listGetRuckedDevices(hass: HomeAssistant): DeviceOption[] {
  const deviceIds = new Set<string>();
  for (const entity of Object.values(hass.entities)) {
    if (entity.platform === PLATFORM && entity.device_id) {
      deviceIds.add(entity.device_id);
    }
  }
  return [...deviceIds]
    .map((id) => {
      const device = hass.devices[id];
      const name = device?.name_by_user || device?.name || id;
      return { id, name };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** The first getrucked entity_id on this device with a given translation_key. */
export function findEntityIdByTranslationKey(
  hass: HomeAssistant,
  deviceId: string,
  translationKey: string,
): string | null {
  for (const [entityId, entity] of Object.entries(hass.entities)) {
    if (
      entity.device_id === deviceId &&
      entity.platform === PLATFORM &&
      entity.translation_key === translationKey
    ) {
      return entityId;
    }
  }
  return null;
}

/** All goal_percent entity_ids on this device (dynamic -- changes with the account's active goals). */
export function findGoalEntityIds(hass: HomeAssistant, deviceId: string): string[] {
  const ids: string[] = [];
  for (const [entityId, entity] of Object.entries(hass.entities)) {
    if (
      entity.device_id === deviceId &&
      entity.platform === PLATFORM &&
      entity.translation_key === "goal_percent"
    ) {
      ids.push(entityId);
    }
  }
  return ids.sort();
}

/** Current state object for an entity_id, or null if unknown to hass.states. */
export function getState(hass: HomeAssistant, entityId: string | null) {
  if (!entityId) return null;
  return hass.states[entityId] ?? null;
}

/**
 * Safely reads a numeric value off an entity state. HA reports a sensor
 * with no data as the literal string "unknown" or "unavailable" -- both
 * are truthy strings, so a naive `state?.state ? Number(state.state) :
 * null` silently produces NaN instead of null, which then prints as a
 * literal "NaN" in any formatted output. This is the one place that
 * conversion should happen.
 */
export function numericState(state: HassEntityState | null): number | null {
  if (!state || NO_VALUE_STATES.has(state.state)) return null;
  const n = Number(state.state);
  return Number.isFinite(n) ? n : null;
}

/** Same null-safety as numericState(), for a raw (non-numeric) state string. */
export function rawState(state: HassEntityState | null): string | null {
  if (!state || NO_VALUE_STATES.has(state.state)) return null;
  return state.state;
}

/**
 * True if there's an active "Premium required" repair issue for this
 * device's config entry. A lapsed-Premium coordinator failure makes every
 * entity report the generic HA "unavailable" state just like any other
 * fetch failure, so entity state alone can't tell the two apart -- the
 * repair issue (created by the coordinator specifically for this case) is
 * the one real signal. hass.issues may not be populated in every context;
 * this degrades to false (a generic "unavailable" card) rather than
 * throwing when it isn't.
 */
export function hasPremiumRequiredIssue(hass: HomeAssistant, deviceId: string): boolean {
  const entryId = hass.devices[deviceId]?.config_entries?.[0];
  if (!entryId || !hass.issues) return false;
  const expectedId = `${entryId}_premium_required`;
  return Object.values(hass.issues).some(
    (issue) => issue.domain === PLATFORM && issue.issue_id === expectedId,
  );
}
