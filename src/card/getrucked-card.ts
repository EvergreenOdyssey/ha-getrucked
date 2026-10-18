import { LitElement, html, css, nothing, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import type { HomeAssistant } from "./hass-types";
import {
  CARD_TAG,
  EDITOR_TAG,
  DEFAULT_METRICS_COMPACT,
  DEFAULT_METRICS_DETAILED,
  DEFAULT_RUCK_FIELDS_COMPACT,
  DEFAULT_RUCK_FIELDS_DETAILED,
  type GetRuckedCardConfig,
  type MetricKey,
  type RuckFieldKey,
} from "./const";
import {
  findEntityIdByTranslationKey,
  findGoalEntityIds,
  getState,
  hasPremiumRequiredIssue,
  listGetRuckedDevices,
} from "./entities";
import * as fmt from "./format";

const LOGO_WORDMARK = "/getrucked-static/logo-wordmark.png";
const LOGO_FULL = "/getrucked-static/logo-full.png";

function fireMoreInfo(el: HTMLElement, entityId: string | null): void {
  if (!entityId) return;
  el.dispatchEvent(
    new CustomEvent("hass-more-info", {
      detail: { entityId },
      bubbles: true,
      composed: true,
    }),
  );
}

export class GetRuckedCard extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @state() private _config!: GetRuckedCardConfig;

  static getStubConfig(hass: HomeAssistant): GetRuckedCardConfig {
    const devices = listGetRuckedDevices(hass);
    return {
      type: `custom:${CARD_TAG}`,
      device_id: devices[0]?.id,
      layout: "compact",
    };
  }

  static getConfigElement(): HTMLElement {
    return document.createElement(EDITOR_TAG);
  }

  setConfig(config: GetRuckedCardConfig): void {
    if (!config) throw new Error("Invalid configuration");
    const layout = config.layout === "detailed" ? "detailed" : "compact";
    this._config = {
      ...config,
      layout,
      metrics:
        config.metrics ??
        (layout === "detailed" ? DEFAULT_METRICS_DETAILED : DEFAULT_METRICS_COMPACT),
      ruck_fields:
        config.ruck_fields ??
        (layout === "detailed" ? DEFAULT_RUCK_FIELDS_DETAILED : DEFAULT_RUCK_FIELDS_COMPACT),
    };
  }

  getCardSize(): number {
    return this._config?.layout === "detailed" ? 8 : 4;
  }

  private _entity(translationKey: string): string | null {
    if (!this._config.device_id) return null;
    return findEntityIdByTranslationKey(this.hass, this._config.device_id, translationKey);
  }

  private _hasMetric(key: MetricKey): boolean {
    return this._config.metrics?.includes(key) ?? false;
  }

  private _hasField(key: RuckFieldKey): boolean {
    return this._config.ruck_fields?.includes(key) ?? false;
  }

  render(): TemplateResult {
    if (!this.hass || !this._config) return html``;

    const deviceId = this._config.device_id;
    const isCompact = this._config.layout !== "detailed";

    if (!deviceId) {
      return this._shell(
        isCompact,
        html`<div class="gr-simple-state">
          <p>No Get-Rucked device selected. Edit this card to pick one.</p>
        </div>`,
      );
    }

    if (hasPremiumRequiredIssue(this.hass, deviceId)) {
      return this._shell(
        isCompact,
        html`<div class="gr-premium">
          <div class="gr-premium-badge">⭐ Premium Feature</div>
          <p class="gr-premium-msg">
            Your Get-Rucked Premium subscription has lapsed, so live stats aren't available right now.
          </p>
          <p class="gr-premium-sub">
            Renew Premium in the Get-Rucked app to bring your stats back.
          </p>
        </div>`,
      );
    }

    const rankEntityId = this._entity("rank");
    const rankState = getState(this.hass, rankEntityId);

    if (!rankState) {
      return this._shell(
        isCompact,
        html`<div class="gr-simple-state">
          <div class="gr-spinner"></div>
          <p>Loading Get-Rucked stats…</p>
        </div>`,
      );
    }

    if (rankState.state === "unavailable") {
      return this._shell(
        isCompact,
        html`<div class="gr-simple-state">
          <p class="gr-warn-icon">⚠️</p>
          <p><strong>Get-Rucked is unavailable</strong></p>
          <p>Check the integration's status in Settings → Devices & Services.</p>
        </div>`,
      );
    }

    return this._shell(isCompact, isCompact ? this._renderCompactBody() : this._renderDetailedBody(), true);
  }

  private _shell(isCompact: boolean, body: TemplateResult, withFooter = false): TemplateResult {
    const logo = isCompact ? LOGO_WORDMARK : LOGO_FULL;
    return html`
      <ha-card>
        <div class="gr-banner ${isCompact ? "compact" : "detailed"}">
          <img src=${logo} alt="Get-Rucked" />
        </div>
        <div class="gr-banner-accent"></div>
        ${body}
        ${withFooter ? this._renderFooter() : nothing}
      </ha-card>
    `;
  }

  private _renderFooter(): TemplateResult {
    const rankEntityId = this._entity("rank");
    const rankState = getState(this.hass, rankEntityId);
    const pollInterval = Number(rankState?.attributes.poll_interval_minutes ?? 15);
    const lastUpdated = rankState?.last_updated ? new Date(rankState.last_updated) : null;
    const { text, stale } = fmt.formatFooter(lastUpdated, pollInterval);
    return html`<div class="gr-footer ${stale ? "stale" : ""}">${text}</div>`;
  }

  private _renderRank(big: boolean): TemplateResult {
    const entityId = this._entity("rank");
    const rankState = getState(this.hass, entityId);
    const nextEntityId = this._entity("distance_to_next_rank");
    const nextState = getState(this.hass, nextEntityId);
    const name = rankState?.state ?? "—";
    const icon = (rankState?.attributes.icon_emoji as string) ?? "🏅";
    const totalMiles = rankState?.attributes.total_miles as number | undefined;
    const nextRankName = rankState?.attributes.next_rank_name as string | undefined;
    const milesToNext = nextState?.state ? Number(nextState.state) : null;

    return html`
      <div class="gr-rank" @click=${() => fireMoreInfo(this, entityId)}>
        <div class="gr-rank-icon" style=${big ? "font-size:40px" : ""}>${icon}</div>
        <div class="gr-rank-main">
          <div class="gr-rank-name" style=${big ? "font-size:19px" : ""}>${name}</div>
          <div class="gr-rank-sub">
            ${nextRankName && milesToNext != null
              ? `${fmt.formatDistance(milesToNext, "mi")} to ${nextRankName}`
              : "Top rank reached"}
          </div>
        </div>
        <div class="gr-rank-miles">
          <div class="num" style=${big ? "font-size:22px" : ""}>
            ${totalMiles != null ? totalMiles.toFixed(2) : "—"}
          </div>
          <div class="unit">mi lifetime</div>
        </div>
      </div>
    `;
  }

  private _renderWeekMonthForm(threeCol: boolean): TemplateResult {
    const weeklyId = this._entity("weekly_distance");
    const weekly = getState(this.hass, weeklyId);
    const monthlyId = this._entity("monthly_distance");
    const monthly = getState(this.hass, monthlyId);
    const tsbId = this._entity("form_tsb");
    const tsbState = getState(this.hass, tsbId);
    const tsb = tsbState?.state ? Number(tsbState.state) : null;
    const label = (tsbState?.attributes.label as string) ?? "";
    const formClass = fmt.formClassForTsb(tsb);

    const chips: TemplateResult[] = [];
    if (this._hasMetric("weekly_distance")) {
      chips.push(html`
        <div class="gr-chip" @click=${() => fireMoreInfo(this, weeklyId)}>
          <div class="gr-chip-label">Weekly${threeCol ? "" : " Distance"}</div>
          <div class="gr-chip-value">
            ${fmt.formatDistance(weekly?.state ? Number(weekly.state) : null, "")}<span class="unit"
              >${weekly?.attributes.unit_of_measurement ?? ""}</span
            >
          </div>
          <div class="gr-chip-sub">${weekly?.attributes.session_count ?? 0} sessions</div>
        </div>
      `);
    }
    if (this._hasMetric("monthly_distance")) {
      chips.push(html`
        <div class="gr-chip" @click=${() => fireMoreInfo(this, monthlyId)}>
          <div class="gr-chip-label">Monthly${threeCol ? "" : " Distance"}</div>
          <div class="gr-chip-value">
            ${fmt.formatDistance(monthly?.state ? Number(monthly.state) : null, "")}<span class="unit"
              >${monthly?.attributes.unit_of_measurement ?? ""}</span
            >
          </div>
          <div class="gr-chip-sub">${monthly?.attributes.session_count ?? 0} sessions</div>
        </div>
      `);
    }
    const formChip = html`
      <div class="gr-chip" @click=${() => fireMoreInfo(this, tsbId)}>
        <div class="gr-chip-label">Form (TSB)</div>
        <div class="gr-chip-value">${tsb ?? "—"}</div>
        <div class="gr-chip-sub ${formClass}">${threeCol ? label.split(" — ")[0] : label}</div>
      </div>
    `;
    if (threeCol && this._hasMetric("form_tsb")) chips.push(formChip);

    if (!chips.length) return html``;
    return html`
      <div class="gr-section-title">This Week / Month${threeCol ? " / Form" : ""}</div>
      <div class="gr-chip-grid ${threeCol ? "cols-3" : ""}">${chips}</div>
      ${!threeCol && this._hasMetric("form_tsb")
        ? html`<div class="gr-section-title">Form</div>
            <div class="gr-chip-grid">${formChip}</div>`
        : nothing}
    `;
  }

  private _renderTrainingLoad(): TemplateResult | typeof nothing {
    if (!this._hasMetric("fitness_ctl") && !this._hasMetric("fatigue_atl")) return nothing;
    const ctlId = this._entity("fitness_ctl");
    const ctl = getState(this.hass, ctlId);
    const atlId = this._entity("fatigue_atl");
    const atl = getState(this.hass, atlId);
    const tsbId = this._entity("form_tsb");
    const tsbState = getState(this.hass, tsbId);
    const tsb = tsbState?.state ? Number(tsbState.state) : null;
    const label = (tsbState?.attributes.label as string) ?? "";
    const formClass = fmt.formClassForTsb(tsb);

    return html`
      <div class="gr-section-title">Training Load</div>
      <div class="gr-chip-grid cols-3">
        <div class="gr-chip" @click=${() => fireMoreInfo(this, ctlId)}>
          <div class="gr-chip-label">Fitness (CTL)</div>
          <div class="gr-chip-value">${ctl?.state ?? "—"}</div>
        </div>
        <div class="gr-chip" @click=${() => fireMoreInfo(this, atlId)}>
          <div class="gr-chip-label">Fatigue (ATL)</div>
          <div class="gr-chip-value">${atl?.state ?? "—"}</div>
        </div>
        <div class="gr-chip" @click=${() => fireMoreInfo(this, tsbId)}>
          <div class="gr-chip-label">Form (TSB)</div>
          <div class="gr-chip-value">${tsb ?? "—"}</div>
          <div class="gr-chip-sub ${formClass}">${label}</div>
        </div>
      </div>
    `;
  }

  private _renderLatestRuck(compact: boolean): TemplateResult | typeof nothing {
    if (!this._hasMetric("latest_ruck")) return nothing;
    const entityId = this._entity("latest_ruck_distance");
    const distState = getState(this.hass, entityId);
    const attrs = distState?.attributes ?? {};
    const distance = distState?.state ? Number(distState.state) : null;
    const distUnit = (attrs.unit_of_measurement as string) ?? "mi";

    const durationState = getState(this.hass, this._entity("latest_ruck_duration"));
    const paceState = getState(this.hass, this._entity("latest_ruck_pace"));
    const weightState = getState(this.hass, this._entity("latest_ruck_pack_weight"));
    const weightUnit = (weightState?.attributes.unit_of_measurement as string) ?? "lbs";
    const elevGainState = getState(this.hass, this._entity("latest_ruck_elevation_gain"));
    const elevGainUnit = (elevGainState?.attributes.unit_of_measurement as string) ?? "ft";
    const weatherState = getState(this.hass, this._entity("latest_ruck_weather_temp"));
    const weatherUnit = (weatherState?.attributes.unit_of_measurement as string) ?? "°F";
    const hrState = getState(this.hass, this._entity("latest_ruck_heart_rate_avg"));
    const caloriesState = getState(this.hass, this._entity("latest_ruck_calories"));
    const stepsState = getState(this.hass, this._entity("latest_ruck_steps"));

    const type = (attrs.type as string) ?? "walk";
    const typeIcon = type === "ruck" ? "🎒" : type === "run" ? "🏃" : "🚶";
    const dateStr = attrs.date ? new Date(attrs.date as string) : null;

    const field = (label: string, value: string | null, sub?: string | null) =>
      value == null
        ? nothing
        : html`<div>
            <div class="gr-field-label">${label}</div>
            <div class="gr-field-value">${value}</div>
            ${sub ? html`<div class="gr-field-sub">${sub}</div>` : nothing}
          </div>`;

    const fields: TemplateResult[] = [];
    if (this._hasField("pack_weight")) {
      fields.push(
        field("Pack" + (compact ? "" : " Weight"), fmt.formatPackWeight(
          weightState?.state ? Number(weightState.state) : null,
          weightUnit,
        )) as TemplateResult,
      );
    }
    if (this._hasField("distance"))
      fields.push(field("Distance", fmt.formatDistance(distance, distUnit)) as TemplateResult);
    if (this._hasField("duration"))
      fields.push(field("Duration", durationState?.state ? `${durationState.state} min` : "—") as TemplateResult);
    if (this._hasField("pace"))
      fields.push(
        field("Pace", fmt.formatPace(paceState?.state ?? null, paceState?.attributes.unit as string)) as TemplateResult,
      );
    if (!compact) {
      if (this._hasField("elevation_gain"))
        fields.push(
          field("Elev. Gain", elevGainState?.state ? `${elevGainState.state} ${elevGainUnit}` : "—") as TemplateResult,
        );
      if (this._hasField("elevation_loss"))
        fields.push(
          field(
            "Elev. Loss",
            attrs.elevation_loss != null ? `${attrs.elevation_loss} ${attrs.elevation_unit ?? "ft"}` : "—",
          ) as TemplateResult,
        );
      if (this._hasField("terrain"))
        fields.push(field("Terrain", (attrs.terrain as string) ?? "—") as TemplateResult);
      const weather = fmt.formatWeather(
        weatherState?.state ? Number(weatherState.state) : null,
        weatherUnit,
        attrs.weather_condition as string,
      );
      if (this._hasField("weather") && weather) fields.push(field("Weather", weather) as TemplateResult);
      const heartRate = fmt.formatHeartRate(
        hrState?.state ? Number(hrState.state) : null,
        hrState?.attributes.max as number,
      );
      if (this._hasField("heart_rate") && heartRate)
        fields.push(field("Heart Rate", heartRate, "avg / max") as TemplateResult);
      if (this._hasField("steps"))
        fields.push(field("Steps", stepsState?.state ? Number(stepsState.state).toLocaleString() : "—") as TemplateResult);
      if (this._hasField("calories"))
        fields.push(field("Calories", caloriesState?.state ?? "—") as TemplateResult);
      if (this._hasField("cadence"))
        fields.push(field("Cadence", attrs.avg_cadence != null ? `${attrs.avg_cadence} spm` : "—") as TemplateResult);
      const dog = fmt.formatDogName(attrs.dog_name as string);
      if (this._hasField("dog") && dog) fields.push(field("Dog", dog) as TemplateResult);
      const stars = fmt.formatStars(attrs.rating as number);
      if (this._hasField("rating") && stars)
        fields.push(html`<div>
          <div class="gr-field-label">Rating</div>
          <div class="gr-field-value gr-stars">${stars}</div>
        </div>`);
    }

    const dateLabel = dateStr
      ? compact
        ? dateStr.toLocaleDateString(undefined, { month: "short", day: "numeric" })
        : dateStr.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })
      : "";

    return html`
      <div class="gr-section-title">Latest Ruck</div>
      ${compact
        ? html`<div class="gr-ruck-head-compact" @click=${() => fireMoreInfo(this, entityId)}>
            <span class="gr-ruck-type">${typeIcon} ${type.charAt(0).toUpperCase() + type.slice(1)}</span>
            <span class="gr-ruck-date"> · ${dateLabel}</span>
          </div>`
        : html`<div class="gr-ruck-head" @click=${() => fireMoreInfo(this, entityId)}>
            <span class="gr-ruck-type">${typeIcon} ${type.charAt(0).toUpperCase() + type.slice(1)}</span>
            <span class="gr-ruck-date">${dateLabel}</span>
          </div>`}
      <div class="gr-ruck-fields ${compact ? "cols-4" : ""}">${fields}</div>
    `;
  }

  private _renderGoals(): TemplateResult | typeof nothing {
    if (!this._hasMetric("goals") || !this._config.device_id) return nothing;
    const goalIds = findGoalEntityIds(this.hass, this._config.device_id);
    if (!goalIds.length) return nothing;

    return html`
      <div class="gr-section-title">Goals</div>
      ${goalIds.map((id) => {
        const s = getState(this.hass, id);
        const a = s?.attributes ?? {};
        return html`
          <div class="gr-goal" @click=${() => fireMoreInfo(this, id)}>
            <div class="gr-goal-head">
              <span class="gr-goal-title">${a.title ?? ""}</span>
              <span class="gr-goal-pct"
                >${fmt.formatGoalLine(
                  a.current_value as number,
                  a.target_value as number,
                  a.unit as string,
                  s?.state ? Number(s.state) : null,
                )}</span
              >
            </div>
            <div class="gr-goal-track">
              <div class="gr-goal-fill" style="width: ${s?.state ?? 0}%;"></div>
            </div>
          </div>
        `;
      })}
    `;
  }

  private _renderCompactBody(): TemplateResult {
    return html`
      <div class="gr-body compact">
        ${this._hasMetric("rank") ? this._renderRank(false) : nothing}
        ${this._renderWeekMonthForm(true)}
        ${this._renderLatestRuck(true)}
      </div>
    `;
  }

  private _renderDetailedBody(): TemplateResult {
    return html`
      <div class="gr-body detailed">
        ${this._hasMetric("rank") ? this._renderRank(true) : nothing}
        ${this._renderWeekMonthForm(false)}
        ${this._renderTrainingLoad()}
        ${this._renderLatestRuck(false)}
        ${this._renderGoals()}
      </div>
    `;
  }

  static styles = css`
    :host {
      --gr-amber: #f59e0b;
      --gr-amber-soft: rgba(245, 158, 11, 0.12);
      --gr-amber-border: rgba(245, 158, 11, 0.35);
      --gr-green: #22c55e;
      --gr-red: #ef4444;
      --gr-chip-bg: var(--secondary-background-color, rgba(128, 128, 128, 0.08));
      --gr-divider: var(--divider-color, rgba(128, 128, 128, 0.2));
    }
    ha-card {
      overflow: hidden;
    }
    .gr-banner {
      background: #000;
      display: flex;
      align-items: center;
      padding: 0 16px;
    }
    .gr-banner.compact {
      height: 42px;
    }
    .gr-banner.detailed {
      height: 60px;
    }
    .gr-banner img {
      display: block;
    }
    .gr-banner.compact img {
      height: 26px;
      width: auto;
    }
    .gr-banner.detailed img {
      height: 48px;
      width: auto;
    }
    .gr-banner-accent {
      height: 3px;
      background: linear-gradient(90deg, var(--gr-amber), #fbbf24);
    }
    .gr-body {
      padding: 14px 18px 4px;
      color: var(--primary-text-color);
    }
    .gr-body.compact {
      padding: 8px 14px 0;
    }
    .gr-section-title {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--secondary-text-color);
      margin: 14px 0 8px;
    }
    .gr-body.compact .gr-section-title {
      margin: 8px 0 4px;
      font-size: 10px;
    }
    .gr-section-title:first-child {
      margin-top: 0;
    }
    .gr-rank {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 12px 14px;
      background: var(--gr-chip-bg);
      border-radius: 10px;
      cursor: pointer;
    }
    .gr-body.compact .gr-rank {
      padding: 7px 10px;
      gap: 9px;
    }
    .gr-rank-icon {
      font-size: 24px;
      line-height: 1;
    }
    .gr-rank-main {
      flex: 1;
      min-width: 0;
    }
    .gr-rank-name {
      font-size: 14px;
      font-weight: 700;
    }
    .gr-rank-sub {
      font-size: 11px;
      color: var(--secondary-text-color);
      margin-top: 2px;
    }
    .gr-rank-miles {
      text-align: right;
    }
    .gr-rank-miles .num {
      font-size: 15px;
      font-weight: 700;
    }
    .gr-rank-miles .unit {
      font-size: 11px;
      color: var(--secondary-text-color);
    }
    .gr-chip-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
    }
    .gr-chip-grid.cols-3 {
      grid-template-columns: repeat(3, 1fr);
    }
    .gr-chip {
      background: var(--gr-chip-bg);
      border-radius: 10px;
      padding: 6px 8px;
      cursor: pointer;
    }
    .gr-body.detailed .gr-chip {
      padding: 9px 11px;
    }
    .gr-chip-label {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: var(--secondary-text-color);
      margin-bottom: 3px;
    }
    .gr-chip-value {
      font-size: 15px;
      font-weight: 700;
      line-height: 1.1;
    }
    .gr-body.detailed .gr-chip-value {
      font-size: 17px;
    }
    .gr-chip-value .unit {
      font-size: 12px;
      font-weight: 500;
      color: var(--secondary-text-color);
      margin-left: 3px;
    }
    .gr-chip-sub {
      font-size: 11px;
      color: var(--secondary-text-color);
      margin-top: 2px;
    }
    .form-fresh {
      color: var(--gr-green);
    }
    .form-neutral {
      color: var(--gr-amber);
    }
    .form-fatigued {
      color: var(--gr-red);
    }
    .gr-ruck-head,
    .gr-ruck-head-compact {
      cursor: pointer;
    }
    .gr-ruck-head {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 8px;
      font-size: 14px;
    }
    .gr-ruck-head-compact {
      font-size: 13px;
      margin-bottom: 7px;
    }
    .gr-ruck-type {
      font-weight: 700;
    }
    .gr-ruck-date {
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .gr-ruck-fields {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 9px 12px;
    }
    .gr-ruck-fields.cols-4 {
      grid-template-columns: repeat(4, 1fr);
      gap: 6px 8px;
    }
    .gr-field-label {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--secondary-text-color);
      margin-bottom: 2px;
    }
    .gr-field-value {
      font-size: 14px;
      font-weight: 600;
    }
    .gr-body.compact .gr-field-value {
      font-size: 12.5px;
    }
    .gr-field-sub {
      font-size: 9.5px;
      color: var(--secondary-text-color);
      margin-top: 1px;
    }
    .gr-stars {
      color: var(--gr-amber);
      font-size: 13px;
      letter-spacing: 1px;
    }
    .gr-goal {
      margin-bottom: 10px;
      cursor: pointer;
    }
    .gr-goal:last-child {
      margin-bottom: 0;
    }
    .gr-goal-head {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      margin-bottom: 5px;
    }
    .gr-goal-title {
      font-weight: 600;
    }
    .gr-goal-pct {
      color: var(--secondary-text-color);
      font-variant-numeric: tabular-nums;
    }
    .gr-goal-track {
      height: 6px;
      border-radius: 3px;
      background: var(--gr-divider);
      overflow: hidden;
    }
    .gr-goal-fill {
      height: 100%;
      background: var(--gr-amber);
      border-radius: 3px;
    }
    .gr-footer {
      padding: 8px 18px 12px;
      font-size: 11px;
      color: var(--secondary-text-color);
    }
    .gr-footer.stale {
      color: var(--gr-red);
      font-weight: 600;
    }
    .gr-premium {
      text-align: center;
      padding: 28px 20px;
    }
    .gr-premium-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: var(--gr-amber-soft);
      border: 1px solid var(--gr-amber-border);
      color: var(--gr-amber);
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      padding: 5px 12px;
      border-radius: 999px;
      margin-bottom: 14px;
    }
    .gr-premium-msg {
      font-size: 14px;
      line-height: 1.6;
      color: var(--primary-text-color);
      max-width: 380px;
      margin: 0 auto;
    }
    .gr-premium-sub {
      font-size: 12px;
      color: var(--secondary-text-color);
      margin-top: 10px;
    }
    .gr-simple-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 36px 20px;
      text-align: center;
      color: var(--primary-text-color);
    }
    .gr-simple-state p {
      margin: 0;
      font-size: 13px;
      color: var(--secondary-text-color);
    }
    .gr-warn-icon {
      font-size: 28px;
      margin-bottom: 4px;
    }
    .gr-spinner {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      border: 2.5px solid var(--gr-divider);
      border-top-color: var(--gr-amber);
      animation: gr-spin 0.9s linear infinite;
    }
    @keyframes gr-spin {
      to {
        transform: rotate(360deg);
      }
    }
  `;
}
