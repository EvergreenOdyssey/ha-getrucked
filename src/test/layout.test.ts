import { describe, expect, it } from "vitest";
import { DEFAULT_METRICS_COMPACT, DEFAULT_METRICS_DETAILED } from "../card/const";
import { normalizeLayout, planWide } from "../card/layout";

describe("normalizeLayout", () => {
  it("passes through supported layouts", () => {
    expect(normalizeLayout("compact")).toBe("compact");
    expect(normalizeLayout("detailed")).toBe("detailed");
    expect(normalizeLayout("wide")).toBe("wide");
  });

  it("falls back to compact for missing or unknown values", () => {
    expect(normalizeLayout(undefined)).toBe("compact");
    expect(normalizeLayout("")).toBe("compact");
    expect(normalizeLayout("panel")).toBe("compact");
  });
});

describe("planWide", () => {
  it("uses three columns with the detailed defaults and goals present", () => {
    const plan = planWide(DEFAULT_METRICS_DETAILED, true);
    expect(plan.columns).toEqual(["progress", "ruck", "goals"]);
    expect(plan.showTrainingLoad).toBe(true);
    // TSB lives in the Training Load row, so it must not repeat in the week row
    expect(plan.formInWeekRow).toBe(false);
  });

  it("drops the goals column when the device has no goals", () => {
    expect(planWide(DEFAULT_METRICS_DETAILED, false).columns).toEqual(["progress", "ruck"]);
  });

  it("drops the goals column when goals are unchecked", () => {
    const metrics = DEFAULT_METRICS_DETAILED.filter((m) => m !== "goals");
    expect(planWide(metrics, true).columns).toEqual(["progress", "ruck"]);
  });

  it("puts Form in the week row when Training Load is off", () => {
    const plan = planWide(DEFAULT_METRICS_COMPACT, false);
    expect(plan.showTrainingLoad).toBe(false);
    expect(plan.formInWeekRow).toBe(true);
    expect(plan.columns).toEqual(["progress", "ruck"]);
  });

  it("shows Training Load if only one of CTL / ATL is checked", () => {
    expect(planWide(["fatigue_atl"], false).showTrainingLoad).toBe(true);
    expect(planWide(["fitness_ctl"], false).showTrainingLoad).toBe(true);
  });

  it("drops the progress column when none of its metrics are checked", () => {
    expect(planWide(["latest_ruck", "goals"], true).columns).toEqual(["ruck", "goals"]);
  });

  it("returns no columns for an empty selection", () => {
    expect(planWide([], true).columns).toEqual([]);
  });
});
