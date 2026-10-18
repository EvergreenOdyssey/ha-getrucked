import { describe, expect, it } from "vitest";
import {
  listGetRuckedDevices,
  findEntityIdByTranslationKey,
  findGoalEntityIds,
  getState,
  hasPremiumRequiredIssue,
  numericState,
  rawState,
} from "../card/entities";
import type { HomeAssistant } from "../card/hass-types";

function makeHass(overrides: Partial<HomeAssistant> = {}): HomeAssistant {
  return {
    states: {},
    entities: {},
    devices: {},
    ...overrides,
  };
}

describe("listGetRuckedDevices", () => {
  it("finds devices only from the getrucked platform", () => {
    const hass = makeHass({
      devices: {
        dev1: { id: "dev1", name: "Get-Rucked" },
        dev2: { id: "dev2", name: "Some Other Thing" },
      },
      entities: {
        "sensor.get_rucked_rank": { entity_id: "sensor.get_rucked_rank", device_id: "dev1", platform: "getrucked", translation_key: "rank" },
        "sensor.other_thing": { entity_id: "sensor.other_thing", device_id: "dev2", platform: "other_integration", translation_key: "foo" },
      },
    });
    const devices = listGetRuckedDevices(hass);
    expect(devices).toEqual([{ id: "dev1", name: "Get-Rucked" }]);
  });

  it("prefers a user-renamed device name", () => {
    const hass = makeHass({
      devices: { dev1: { id: "dev1", name: "Get-Rucked", name_by_user: "My Ruck Stats" } },
      entities: {
        "sensor.x": { entity_id: "sensor.x", device_id: "dev1", platform: "getrucked", translation_key: "rank" },
      },
    });
    expect(listGetRuckedDevices(hass)).toEqual([{ id: "dev1", name: "My Ruck Stats" }]);
  });
});

describe("findEntityIdByTranslationKey", () => {
  it("matches by translation_key, not a hardcoded entity_id", () => {
    const hass = makeHass({
      entities: {
        "sensor.some_weird_slug_3": {
          entity_id: "sensor.some_weird_slug_3",
          device_id: "dev1",
          platform: "getrucked",
          translation_key: "weekly_distance",
        },
      },
    });
    expect(findEntityIdByTranslationKey(hass, "dev1", "weekly_distance")).toBe(
      "sensor.some_weird_slug_3",
    );
  });

  it("returns null when no match", () => {
    const hass = makeHass();
    expect(findEntityIdByTranslationKey(hass, "dev1", "weekly_distance")).toBeNull();
  });

  it("ignores entities on a different device or platform", () => {
    const hass = makeHass({
      entities: {
        "sensor.wrong_device": {
          entity_id: "sensor.wrong_device",
          device_id: "dev2",
          platform: "getrucked",
          translation_key: "rank",
        },
        "sensor.wrong_platform": {
          entity_id: "sensor.wrong_platform",
          device_id: "dev1",
          platform: "other",
          translation_key: "rank",
        },
      },
    });
    expect(findEntityIdByTranslationKey(hass, "dev1", "rank")).toBeNull();
  });
});

describe("findGoalEntityIds", () => {
  it("collects every goal_percent entity on the device, sorted", () => {
    const hass = makeHass({
      entities: {
        "sensor.goal_b": { entity_id: "sensor.goal_b", device_id: "dev1", platform: "getrucked", translation_key: "goal_percent" },
        "sensor.goal_a": { entity_id: "sensor.goal_a", device_id: "dev1", platform: "getrucked", translation_key: "goal_percent" },
        "sensor.rank": { entity_id: "sensor.rank", device_id: "dev1", platform: "getrucked", translation_key: "rank" },
      },
    });
    expect(findGoalEntityIds(hass, "dev1")).toEqual(["sensor.goal_a", "sensor.goal_b"]);
  });

  it("returns an empty list when there are no goals", () => {
    const hass = makeHass();
    expect(findGoalEntityIds(hass, "dev1")).toEqual([]);
  });
});

describe("numericState", () => {
  it("parses a real numeric state", () => {
    expect(numericState({ entity_id: "x", state: "42", attributes: {} })).toBe(42);
  });

  it(
    'returns null for HA\'s "unknown"/"unavailable" states, not NaN -- ' +
      'the real beta.4 bug: `state?.state ? Number(state.state) : null` lets ' +
      '"unknown" (a truthy string) through to Number(), producing NaN',
    () => {
      expect(numericState({ entity_id: "x", state: "unknown", attributes: {} })).toBeNull();
      expect(numericState({ entity_id: "x", state: "unavailable", attributes: {} })).toBeNull();
    },
  );

  it("returns null for a missing state object", () => {
    expect(numericState(null)).toBeNull();
  });

  it("returns null rather than NaN for genuinely unparseable text", () => {
    expect(numericState({ entity_id: "x", state: "not a number", attributes: {} })).toBeNull();
  });

  it("treats 0 as a real value, not as falsy/missing", () => {
    expect(numericState({ entity_id: "x", state: "0", attributes: {} })).toBe(0);
  });
});

describe("rawState", () => {
  it("returns the state string when present", () => {
    expect(rawState({ entity_id: "x", state: "Iron Back", attributes: {} })).toBe("Iron Back");
  });

  it('returns null for "unknown"/"unavailable", not the literal string', () => {
    expect(rawState({ entity_id: "x", state: "unknown", attributes: {} })).toBeNull();
    expect(rawState({ entity_id: "x", state: "unavailable", attributes: {} })).toBeNull();
  });

  it("returns null for a missing state object", () => {
    expect(rawState(null)).toBeNull();
  });
});

describe("getState", () => {
  it("returns the state object for a known entity", () => {
    const hass = makeHass({
      states: { "sensor.x": { entity_id: "sensor.x", state: "42", attributes: {} } },
    });
    expect(getState(hass, "sensor.x")?.state).toBe("42");
  });

  it("returns null for a null entity_id or unknown entity", () => {
    const hass = makeHass();
    expect(getState(hass, null)).toBeNull();
    expect(getState(hass, "sensor.missing")).toBeNull();
  });
});

describe("hasPremiumRequiredIssue", () => {
  it("true when a matching repair issue exists", () => {
    const hass = makeHass({
      devices: { dev1: { id: "dev1", config_entries: ["entry123"] } },
      issues: {
        "getrucked.entry123_premium_required": {
          domain: "getrucked",
          issue_id: "entry123_premium_required",
        },
      },
    });
    expect(hasPremiumRequiredIssue(hass, "dev1")).toBe(true);
  });

  it("false when hass.issues is absent", () => {
    const hass = makeHass({ devices: { dev1: { id: "dev1", config_entries: ["entry123"] } } });
    expect(hasPremiumRequiredIssue(hass, "dev1")).toBe(false);
  });

  it("false when the issue is for a different domain or entry", () => {
    const hass = makeHass({
      devices: { dev1: { id: "dev1", config_entries: ["entry123"] } },
      issues: {
        a: { domain: "other_domain", issue_id: "entry123_premium_required" },
        b: { domain: "getrucked", issue_id: "entry999_premium_required" },
      },
    });
    expect(hasPremiumRequiredIssue(hass, "dev1")).toBe(false);
  });
});
