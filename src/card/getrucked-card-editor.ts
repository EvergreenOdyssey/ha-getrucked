import { LitElement, html, css, type TemplateResult } from "lit";
import { state } from "lit/decorators.js";
import type { HomeAssistant } from "./hass-types";
import {
  METRIC_KEYS,
  RUCK_FIELD_KEYS,
  DEFAULT_METRICS_COMPACT,
  DEFAULT_METRICS_DETAILED,
  DEFAULT_RUCK_FIELDS_COMPACT,
  DEFAULT_RUCK_FIELDS_DETAILED,
  type GetRuckedCardConfig,
  type Layout,
  type MetricKey,
  type RuckFieldKey,
} from "./const";
import { listGetRuckedDevices } from "./entities";

const METRIC_LABELS: Record<MetricKey, string> = {
  rank: "Rank",
  weekly_distance: "Weekly Distance",
  monthly_distance: "Monthly Distance",
  fitness_ctl: "Fitness (CTL)",
  fatigue_atl: "Fatigue (ATL)",
  form_tsb: "Form (TSB)",
  distance_to_next_rank: "Distance To Next Rank",
  latest_ruck: "Latest Ruck",
  goals: "Goals",
};

const RUCK_FIELD_LABELS: Record<RuckFieldKey, string> = {
  date: "Date",
  type: "Type",
  pack_weight: "Pack Weight",
  distance: "Distance",
  duration: "Duration",
  pace: "Pace",
  elevation_gain: "Elevation Gain",
  elevation_loss: "Elevation Loss",
  steps: "Steps",
  calories: "Calories",
  cadence: "Cadence",
  terrain: "Terrain",
  rating: "Rating",
  weather: "Weather",
  heart_rate: "Heart Rate",
  dog: "Dog",
};

export class GetRuckedCardEditor extends LitElement {
  hass!: HomeAssistant;
  @state() private _config!: GetRuckedCardConfig;

  setConfig(config: GetRuckedCardConfig): void {
    this._config = { ...config };
  }

  private _emitChange(): void {
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this._config },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _setLayout(layout: Layout): void {
    const defaultsChanged =
      this._config.metrics === undefined ||
      this._config.metrics === DEFAULT_METRICS_COMPACT ||
      this._config.metrics === DEFAULT_METRICS_DETAILED;
    this._config = {
      ...this._config,
      layout,
      // Re-seed the field lists with that layout's defaults only if the
      // user hadn't customized them yet, so switching layout doesn't
      // silently discard a deliberate selection.
      ...(defaultsChanged
        ? {
            metrics: layout === "detailed" ? DEFAULT_METRICS_DETAILED : DEFAULT_METRICS_COMPACT,
            ruck_fields:
              layout === "detailed" ? DEFAULT_RUCK_FIELDS_DETAILED : DEFAULT_RUCK_FIELDS_COMPACT,
          }
        : {}),
    };
    this._emitChange();
  }

  private _toggle<K extends string>(
    listKey: "metrics" | "ruck_fields",
    key: K,
    allOrder: readonly K[],
  ): void {
    const current = ((this._config[listKey] as K[] | undefined) ?? []).slice();
    const idx = current.indexOf(key);
    if (idx >= 0) {
      current.splice(idx, 1);
    } else {
      current.push(key);
      current.sort((a, b) => allOrder.indexOf(a) - allOrder.indexOf(b));
    }
    this._config = { ...this._config, [listKey]: current };
    this._emitChange();
  }

  private _move(listKey: "metrics" | "ruck_fields", index: number, dir: -1 | 1): void {
    const current = ((this._config[listKey] as string[] | undefined) ?? []).slice();
    const target = index + dir;
    if (target < 0 || target >= current.length) return;
    [current[index], current[target]] = [current[target], current[index]];
    this._config = { ...this._config, [listKey]: current };
    this._emitChange();
  }

  private _renderList<K extends string>(
    title: string,
    listKey: "metrics" | "ruck_fields",
    allKeys: readonly K[],
    labels: Record<K, string>,
  ): TemplateResult {
    const selected = ((this._config[listKey] as K[] | undefined) ?? []) as K[];
    const unselected = allKeys.filter((k) => !selected.includes(k));

    return html`
      <div class="gr-editor-section">
        <div class="gr-editor-title">${title}</div>
        <div class="gr-editor-list">
          ${selected.map(
            (key, i) => html`
              <div class="gr-editor-row">
                <label>
                  <input
                    type="checkbox"
                    checked
                    @change=${() => this._toggle(listKey, key, allKeys)}
                  />
                  ${labels[key]}
                </label>
                <span class="gr-editor-reorder">
                  <button
                    type="button"
                    ?disabled=${i === 0}
                    @click=${() => this._move(listKey, i, -1)}
                    aria-label="Move ${labels[key]} up"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    ?disabled=${i === selected.length - 1}
                    @click=${() => this._move(listKey, i, 1)}
                    aria-label="Move ${labels[key]} down"
                  >
                    ▼
                  </button>
                </span>
              </div>
            `,
          )}
          ${unselected.map(
            (key) => html`
              <div class="gr-editor-row gr-editor-row-off">
                <label>
                  <input type="checkbox" @change=${() => this._toggle(listKey, key, allKeys)} />
                  ${labels[key]}
                </label>
              </div>
            `,
          )}
        </div>
      </div>
    `;
  }

  render(): TemplateResult {
    if (!this.hass || !this._config) return html``;
    const devices = listGetRuckedDevices(this.hass);
    const layout: Layout = this._config.layout === "detailed" ? "detailed" : "compact";

    return html`
      <div class="gr-editor-section">
        <div class="gr-editor-title">Device</div>
        <select
          @change=${(e: Event) => {
            this._config = { ...this._config, device_id: (e.target as HTMLSelectElement).value };
            this._emitChange();
          }}
        >
          ${devices.map(
            (d) => html`<option value=${d.id} ?selected=${d.id === this._config.device_id}>
              ${d.name}
            </option>`,
          )}
        </select>
        ${devices.length === 0
          ? html`<p class="gr-editor-hint">No Get-Rucked device found. Add the integration first.</p>`
          : ""}
      </div>

      <div class="gr-editor-section">
        <div class="gr-editor-title">Layout</div>
        <label
          ><input
            type="radio"
            name="layout"
            value="compact"
            .checked=${layout === "compact"}
            @change=${() => this._setLayout("compact")}
          />
          Compact</label
        >
        <label
          ><input
            type="radio"
            name="layout"
            value="detailed"
            .checked=${layout === "detailed"}
            @change=${() => this._setLayout("detailed")}
          />
          Detailed</label
        >
      </div>

      ${this._renderList("Metrics (checked = shown, use ▲▼ to reorder)", "metrics", METRIC_KEYS, METRIC_LABELS)}
      ${this._config.metrics?.includes("latest_ruck")
        ? this._renderList(
            "Latest Ruck fields",
            "ruck_fields",
            RUCK_FIELD_KEYS,
            RUCK_FIELD_LABELS,
          )
        : ""}

      <p class="gr-editor-hint">
        You can also edit this card as YAML (switch via the card editor's own toggle) for full control.
      </p>
    `;
  }

  static styles = css`
    :host {
      display: block;
      color: var(--primary-text-color);
    }
    .gr-editor-section {
      margin-bottom: 20px;
    }
    .gr-editor-title {
      font-size: 13px;
      font-weight: 700;
      margin-bottom: 8px;
    }
    .gr-editor-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 4px 0;
      font-size: 13px;
    }
    .gr-editor-row-off {
      opacity: 0.6;
    }
    .gr-editor-reorder button {
      background: none;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px;
      cursor: pointer;
      padding: 2px 6px;
      margin-left: 4px;
    }
    .gr-editor-reorder button:disabled {
      opacity: 0.3;
      cursor: default;
    }
    select {
      width: 100%;
      padding: 6px 8px;
      font-size: 13px;
    }
    .gr-editor-hint {
      font-size: 12px;
      color: var(--secondary-text-color);
    }
  `;
}
