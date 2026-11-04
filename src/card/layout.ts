import type { Layout, MetricKey } from "./const";

/** Normalize any config value to a supported layout (unknown -> compact). */
export function normalizeLayout(value: unknown): Layout {
  return value === "detailed" || value === "wide" ? value : "compact";
}

export type WideColumn = "progress" | "ruck" | "goals";

export interface WidePlan {
  /** Columns to render, left to right. Empty columns are dropped. */
  columns: WideColumn[];
  /** Training Load row (CTL / ATL / TSB) is shown in the progress column. */
  showTrainingLoad: boolean;
  /**
   * Form (TSB) rides along in the week/month row only when the Training
   * Load row isn't shown -- otherwise TSB would appear twice.
   */
  formInWeekRow: boolean;
}

/**
 * Decide what the wide layout renders for a given metric selection.
 * `hasGoals` is whether the device currently has any goal entities.
 */
export function planWide(metrics: readonly MetricKey[], hasGoals: boolean): WidePlan {
  const has = (k: MetricKey) => metrics.includes(k);
  const showTrainingLoad = has("fitness_ctl") || has("fatigue_atl");
  const formInWeekRow = !showTrainingLoad && has("form_tsb");

  const progress =
    has("rank") || has("weekly_distance") || has("monthly_distance") || showTrainingLoad || formInWeekRow;

  const columns: WideColumn[] = [];
  if (progress) columns.push("progress");
  if (has("latest_ruck")) columns.push("ruck");
  if (has("goals") && hasGoals) columns.push("goals");

  return { columns, showTrainingLoad, formInWeekRow };
}
