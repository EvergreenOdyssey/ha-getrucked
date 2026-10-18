// Pure formatting helpers -- no DOM, no hass, fully unit-testable.

/** Distances are always shown to 2 decimals, matching the real ha-stats
 * values (round2() server-side) rather than re-rounding them for display. */
export function formatDistance(value: number | null | undefined, unit: string | null | undefined): string {
  if (value == null) return "—";
  return `${value.toFixed(2)} ${unit ?? ""}`.trim();
}

export function formatPackWeight(
  value: number | null | undefined,
  unit: string | null | undefined,
): string {
  if (value == null) return "No pack";
  return `${value.toFixed(1)} ${unit ?? ""}`.trim();
}

/** "19:27 /mi" -- a literal space before the unit, everywhere, per spec. */
export function formatPace(pace: string | null | undefined, paceUnit: string | null | undefined): string {
  if (!pace) return "—";
  const suffix = paceUnit?.includes("km") ? "/km" : "/mi";
  return `${pace} ${suffix}`;
}

export function formatGoalLine(
  current: number | null | undefined,
  target: number | null | undefined,
  unit: string | null | undefined,
  percent: number | null | undefined,
): string {
  const c = current != null ? current.toFixed(2) : "0.00";
  const t = target != null ? String(target) : "?";
  const p = percent != null ? percent : 0;
  return `${c} / ${t} ${unit ?? ""} · ${p}%`.replace(/\s+·/, " ·");
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
  if (temp == null && !condition) return null;
  const parts: string[] = [];
  if (temp != null) parts.push(`${Math.round(temp)}${tempUnit ?? ""}`);
  if (condition) parts.push(condition);
  return parts.join(" · ");
}

export function formatHeartRate(
  avg: number | null | undefined,
  max: number | null | undefined,
): string | null {
  if (avg == null && max == null) return null;
  const a = avg != null ? Math.round(avg) : "—";
  const m = max != null ? Math.round(max) : "—";
  return `${a} / ${m} bpm`;
}

export function formatDogName(dogName: string | null | undefined): string | null {
  if (!dogName) return null;
  return `🐕 ${dogName}`;
}

export function formatStars(rating: number | null | undefined): string | null {
  if (rating == null) return null;
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
