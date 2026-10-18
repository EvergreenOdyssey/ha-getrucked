// Pure formatting helpers -- no DOM, no hass, fully unit-testable.
//
// Every function here treats `null`, `undefined`, AND `NaN` as "no value" --
// not just null/undefined -- because the real-world bug this guards against
// is a caller passing Number("unknown") (NaN) through, not just a missing
// value. See entities.ts's numericState() for where that conversion should
// happen in the first place.

function isNoValue(n: number | null | undefined): n is null | undefined {
  return n == null || Number.isNaN(n);
}

/** "Pavement", not "pavement" -- for raw lowercase enum-style fields
 * (terrain, and anything similar). Human-authored text (goal titles, the
 * dog's name, weather conditions already worded by the API) must NOT go
 * through this -- it would mangle real casing. */
export function capitalize(value: string | null | undefined): string {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/** "1 session" / "4 sessions". */
export function pluralize(count: number, singular: string, plural: string = `${singular}s`): string {
  return count === 1 ? singular : plural;
}

/** Distances are always shown to 2 decimals, matching the real ha-stats
 * values (round2() server-side) rather than re-rounding them for display. */
export function formatDistance(value: number | null | undefined, unit: string | null | undefined): string {
  if (isNoValue(value)) return "—";
  return `${value.toFixed(2)} ${unit ?? ""}`.trim();
}

export function formatPackWeight(
  value: number | null | undefined,
  unit: string | null | undefined,
): string {
  if (isNoValue(value)) return "No pack";
  return `${value.toFixed(1)} ${unit ?? ""}`.trim();
}

/** "19:27 /mi" -- a literal space before the unit, everywhere, per spec. */
export function formatPace(pace: string | null | undefined, paceUnit: string | null | undefined): string {
  if (!pace) return "—";
  const suffix = paceUnit?.includes("km") ? "/km" : "/mi";
  return `${pace} ${suffix}`;
}

const DISTANCE_UNITS = new Set(["mi", "km"]);

/** "2.21 / 50 mi · 4%" for distance goals; "1 / 4 sessions · 25%" (integers,
 * no decimals) for count-type goals (sessions, calories, duration-in-minutes). */
export function formatGoalLine(
  current: number | null | undefined,
  target: number | null | undefined,
  unit: string | null | undefined,
  percent: number | null | undefined,
): string {
  const isDistance = unit != null && DISTANCE_UNITS.has(unit);
  const safeCurrent = isNoValue(current) ? 0 : current;
  const safeTarget = isNoValue(target) ? 0 : target;
  const safePercent = isNoValue(percent) ? 0 : percent;

  // Only current_value is forced to 2 decimals (it's a computed running
  // total) -- target_value is shown as the user set it, typically a plain
  // integer ("50 mile challenge" -> target 50, not "50.00").
  const c = isDistance ? safeCurrent.toFixed(2) : String(Math.round(safeCurrent));
  const t = isDistance ? String(safeTarget) : String(Math.round(safeTarget));
  const unitWord =
    unit === "sessions" ? pluralize(Math.round(safeTarget), "session") : (unit ?? "");

  return `${c} / ${t} ${unitWord} · ${safePercent}%`.replace(/\s+·/, " ·");
}

export type FormClass = "form-fresh" | "form-neutral" | "form-fatigued";

/** Same thresholds as getFormStatus() in the app / ha-stats: tsb>10 fresh,
 * tsb<-10 fatigued, otherwise neutral. */
export function formClassForTsb(tsb: number | null | undefined): FormClass {
  if (tsb == null) return "form-neutral";
  if (tsb > 10) return "form-fresh";
  if (tsb < -10) return "form-fatigued";
  return "form-neutral";
}

export function formatWeather(
  temp: number | null | undefined,
  tempUnit: string | null | undefined,
  condition: string | null | undefined,
): string | null {
  if (isNoValue(temp) && !condition) return null;
  const parts: string[] = [];
  if (!isNoValue(temp)) parts.push(`${Math.round(temp)}${tempUnit ?? ""}`);
  if (condition) parts.push(condition);
  return parts.join(" · ");
}

export function formatHeartRate(
  avg: number | null | undefined,
  max: number | null | undefined,
): string | null {
  if (isNoValue(avg) && isNoValue(max)) return null;
  const a = !isNoValue(avg) ? Math.round(avg) : "—";
  const m = !isNoValue(max) ? Math.round(max) : "—";
  return `${a} / ${m} bpm`;
}

export function formatDogName(dogName: string | null | undefined): string | null {
  if (!dogName) return null;
  return `🐕 ${dogName}`;
}

export function formatStars(rating: number | null | undefined): string | null {
  if (isNoValue(rating)) return null;
  const clamped = Math.max(0, Math.min(5, Math.round(rating)));
  return "★".repeat(clamped) + "☆".repeat(5 - clamped);
}

export interface FooterStatus {
  text: string;
  stale: boolean;
}

/** "Updated 2:05 PM", flagged stale if older than 2x the poll interval. */
export function formatFooter(
  lastUpdated: Date | null,
  pollIntervalMinutes: number,
  now: Date = new Date(),
): FooterStatus {
  if (!lastUpdated) {
    return { text: "Not updated yet", stale: false };
  }
  const time = lastUpdated.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
  const ageMs = now.getTime() - lastUpdated.getTime();
  const staleThresholdMs = 2 * pollIntervalMinutes * 60 * 1000;
  const stale = ageMs > staleThresholdMs;
  return {
    text: stale ? `⚠ Updated ${time} — data may be stale` : `Updated ${time}`,
    stale,
  };
}
