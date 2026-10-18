import { GetRuckedCard } from "./getrucked-card";
import { GetRuckedCardEditor } from "./getrucked-card-editor";
import { CARD_TAG, EDITOR_TAG } from "./const";

customElements.define(CARD_TAG, GetRuckedCard);
customElements.define(EDITOR_TAG, GetRuckedCardEditor);

declare global {
  interface Window {
    customCards?: Array<Record<string, unknown>>;
  }
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: CARD_TAG,
  name: "Get-Rucked",
  description: "Shows your Get-Rucked stats: rank, weekly/monthly distance, training load, the latest ruck, and goals.",
  preview: true,
});
