import { describe, expect, it } from "vitest";
import {
  formatDistance,
  formatPackWeight,
  formatPace,
  formatGoalLine,
  formClassForTsb,
  formatWeather,
  formatHeartRate,
  formatDogName,
  formatStars,
  formatFooter,
  capitalize,
  pluralize,
} from "../card/format";

describe("formatDistance", () => {
  it("always shows 2 decimals", () => {
    expect(formatDistance(196.18, "mi")).toBe("196.18 mi");
    expect(formatDistance(0, "mi")).toBe("0.00 mi");
    expect(formatDistance(2.2, "mi")).toBe("2.20 mi");
  });
  it("handles null", () => {
    expect(formatDistance(null, "mi")).toBe("—");
  });
  it("treats NaN the same as null, rather than printing literal NaN", () => {
    expect(formatDistance(NaN, "mi")).toBe("—");
  });
});

describe("formatPackWeight", () => {
  it('shows "No pack" when weight is null', () => {
    expect(formatPackWeight(null, "lbs")).toBe("No pack");
  });
  it("shows 1 decimal when present", () => {
    expect(formatPackWeight(35, "lbs")).toBe("35.0 lbs");
  });
  it('shows "No pack" for NaN, not "NaN lb" -- the real beta.4 bug: ' +
    "Number('unknown') is NaN, and a naive null-check lets NaN through", () => {
    expect(formatPackWeight(NaN, "lb")).toBe("No pack");
  });
});

describe("formatPace", () => {
  it('uses "19:27 /mi" format with a space before the unit', () => {
    expect(formatPace("19:27", "min/mi")).toBe("19:27 /mi");
  });
  it("switches to /km for metric", () => {
    expect(formatPace("12:00", "min/km")).toBe("12:00 /km");
  });
  it("handles missing pace", () => {
    expect(formatPace(null, "min/mi")).toBe("—");
  });
});

describe("formatGoalLine", () => {
  it('matches the "2.21 / 50 mi · 4%" format for distance goals (2 decimals)', () => {
    expect(formatGoalLine(2.21, 50, "mi", 4)).toBe("2.21 / 50 mi · 4%");
  });
  it("shows integers, not decimals, for count-type (sessions) goals", () => {
    expect(formatGoalLine(0, 4, "sessions", 0)).toBe("0 / 4 sessions · 0%");
    expect(formatGoalLine(1, 4, "sessions", 25)).toBe("1 / 4 sessions · 25%");
  });
  it('pluralizes the unit word to match the target count ("1 / 1 session" vs "1 / 4 sessions")', () => {
    expect(formatGoalLine(0, 1, "sessions", 0)).toBe("0 / 1 session · 0%");
    expect(formatGoalLine(1, 1, "sessions", 100)).toBe("1 / 1 session · 100%");
    expect(formatGoalLine(1, 4, "sessions", 25)).toBe("1 / 4 sessions · 25%");
  });
  it("is NaN-safe for both numbers and percent", () => {
    expect(formatGoalLine(NaN, NaN, "mi", NaN)).toBe("0.00 / 0 mi · 0%");
    expect(formatGoalLine(NaN, NaN, "sessions", NaN)).toBe("0 / 0 sessions · 0%");
  });
});

describe("formClassForTsb", () => {
  it("fresh above 10", () => {
    expect(formClassForTsb(14)).toBe("form-fresh");
    expect(formClassForTsb(11)).toBe("form-fresh");
  });
  it("fatigued below -10", () => {
    expect(formClassForTsb(-11)).toBe("form-fatigued");
  });
  it("neutral in between, inclusive of the boundaries", () => {
    expect(formClassForTsb(10)).toBe("form-neutral");
    expect(formClassForTsb(-10)).toBe("form-neutral");
    expect(formClassForTsb(0)).toBe("form-neutral");
  });
  it("neutral when unknown", () => {
    expect(formClassForTsb(null)).toBe("form-neutral");
  });
});

describe("formatWeather", () => {
  it("matches the real example", () => {
    expect(formatWeather(68, "°F", "Overcast")).toBe("68°F · Overcast");
  });
  it("returns null when both parts are missing", () => {
    expect(formatWeather(null, "°F", null)).toBeNull();
  });
  it("handles only one part present", () => {
    expect(formatWeather(null, "°F", "Overcast")).toBe("Overcast");
    expect(formatWeather(68, "°F", null)).toBe("68°F");
  });
  it("treats a NaN temp as absent, falling back to condition alone", () => {
    expect(formatWeather(NaN, "°F", "Overcast")).toBe("Overcast");
  });
});

describe("formatHeartRate", () => {
  it("matches the real example", () => {
    expect(formatHeartRate(107, 129)).toBe("107 / 129 bpm");
  });
  it("returns null when absent", () => {
    expect(formatHeartRate(null, null)).toBeNull();
  });
  it("shows a dash for whichever side is NaN, not a literal NaN", () => {
    expect(formatHeartRate(NaN, 129)).toBe("— / 129 bpm");
    expect(formatHeartRate(107, NaN)).toBe("107 / — bpm");
  });
});

describe("formatDogName", () => {
  it("prefixes with the dog emoji", () => {
    expect(formatDogName("Barrett")).toBe("🐕 Barrett");
  });
  it("returns null when no dog", () => {
    expect(formatDogName(null)).toBeNull();
  });
});

describe("formatStars", () => {
  it("renders filled/empty stars", () => {
    expect(formatStars(4)).toBe("★★★★☆");
    expect(formatStars(0)).toBe("☆☆☆☆☆");
    expect(formatStars(5)).toBe("★★★★★");
  });
  it("returns null when unrated", () => {
    expect(formatStars(null)).toBeNull();
  });
  it("returns null for NaN rather than a garbled star string", () => {
    expect(formatStars(NaN)).toBeNull();
  });
});

describe("capitalize", () => {
  it('"pavement" -> "Pavement"', () => {
    expect(capitalize("pavement")).toBe("Pavement");
  });
  it("leaves already-capitalized text alone", () => {
    expect(capitalize("Trail")).toBe("Trail");
  });
  it("handles empty/missing input without throwing", () => {
    expect(capitalize("")).toBe("");
    expect(capitalize(null)).toBe("");
    expect(capitalize(undefined)).toBe("");
  });
});

describe("pluralize", () => {
  it('"1 sessions" -> "1 session": singular only at exactly 1', () => {
    expect(pluralize(1, "session")).toBe("session");
  });
  it("plural for 0 and for >1", () => {
    expect(pluralize(0, "session")).toBe("sessions");
    expect(pluralize(2, "session")).toBe("sessions");
    expect(pluralize(4, "session")).toBe("sessions");
  });
  it("accepts an irregular plural", () => {
    expect(pluralize(1, "goal")).toBe("goal");
    expect(pluralize(3, "goal")).toBe("goals");
  });
});

describe("formatFooter", () => {
  it("shows a plain updated time when fresh", () => {
    const now = new Date("2026-01-01T14:10:00");
    const lastUpdated = new Date("2026-01-01T14:05:00");
    const result = formatFooter(lastUpdated, 15, now);
    expect(result.stale).toBe(false);
    expect(result.text).toContain("Updated");
    expect(result.text).not.toContain("stale");
  });
  it("flags stale past 2x the poll interval", () => {
    const now = new Date("2026-01-01T14:40:01");
    const lastUpdated = new Date("2026-01-01T14:05:00"); // 35m1s old, interval 15m -> threshold 30m
    const result = formatFooter(lastUpdated, 15, now);
    expect(result.stale).toBe(true);
    expect(result.text).toContain("stale");
  });
  it("is not stale exactly at the threshold boundary", () => {
    const now = new Date("2026-01-01T14:35:00");
    const lastUpdated = new Date("2026-01-01T14:05:00"); // exactly 30m, interval 15m -> threshold 30m
    const result = formatFooter(lastUpdated, 15, now);
    expect(result.stale).toBe(false);
  });
});
