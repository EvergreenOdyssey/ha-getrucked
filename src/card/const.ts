export const CARD_TAG = "getrucked-card";
export const EDITOR_TAG = "getrucked-card-editor";
export const PLATFORM = "getrucked";

export type Layout = "compact" | "detailed";

/** Main-section metric keys, matching sensor.py's translation_key values. */
export const METRIC_KEYS = [
  "rank",
  "weekly_distance",
  "monthly_distance",
  "fitness_ctl",
  "fatigue_atl",
  "form_tsb",
  "distance_to_next_rank",
  "latest_ruck",
  "goals",
] as const;
export type MetricKey = (typeof METRIC_KEYS)[number];

export const DEFAULT_METRICS_COMPACT: MetricKey[] = [
  "rank",
  "weekly_distance",
  "monthly_distance",
  "form_tsb",
  "latest_ruck",
];

export const DEFAULT_METRICS_DETAILED: MetricKey[] = [
  "rank",
  "weekly_distance",
  "monthly_distance",
  "fitness_ctl",
  "fatigue_atl",
  "form_tsb",
  "latest_ruck",
  "goals",
];

/** Latest Ruck field keys, matching the ha-stats latest_ruck response shape. */
export const RUCK_FIELD_KEYS = [
  "date",
  "type",
  "pack_weight",
  "distance",
  "duration",
  "pace",
  "elevation_gain",
  "elevation_loss",
  "steps",
  "calories",
  "cadence",
  "terrain",
  "rating",
  "weather",
  "heart_rate",
  "dog",
] as const;
export type RuckFieldKey = (typeof RUCK_FIELD_KEYS)[number];

export const DEFAULT_RUCK_FIELDS_COMPACT: RuckFieldKey[] = [
  "pack_weight",
  "distance",
  "duration",
  "pace",
];

export const DEFAULT_RUCK_FIELDS_DETAILED: RuckFieldKey[] = [
  "pack_weight",
  "distance",
  "duration",
  "pace",
  "elevation_gain",
  "elevation_loss",
  "terrain",
  "weather",
  "heart_rate",
  "steps",
  "calories",
  "cadence",
  "dog",
  "rating",
];

export interface GetRuckedCardConfig {
  type: string;
  device_id?: string;
  layout?: Layout;
  metrics?: MetricKey[];
  ruck_fields?: RuckFieldKey[];
  title?: string;
}
