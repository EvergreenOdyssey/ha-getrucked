# Get-Rucked for Home Assistant

A [HACS](https://hacs.xyz/) custom integration that pulls your [Get-Rucked](https://www.get-rucked.com/) stats — latest ruck, weekly/monthly distance, goals, training load (CTL/ATL/TSB), and rank — into Home Assistant. Requires an active **Get-Rucked Premium** subscription.

## Install

How you add this repository depends on your Home Assistant version:

### Home Assistant 2026.10 and older (HACS)

1. In HACS, open the **⋮** menu (top right) → **Custom repositories** → paste `EvergreenOdyssey/ha-getrucked` → category **Integration** → **Add**.
2. Install **Get-Rucked** from HACS, then restart Home Assistant.

### Home Assistant 2026.11 and newer (Marketplace)

Starting with 2026.11, the standalone HACS integration is replaced by **Marketplace**, built into Home Assistant under **Settings → Marketplace**. It reads the same catalog as HACS and uses the same `hacs.json`, so this repo doesn't need separate support for it — but it does apply stricter checks before installing a repo, and (per the official docs) expects the repo to have at least one published **release**, not just commits on the default branch. This repo isn't tagged yet (see Status below), so if you're already on 2026.11+, installing via Marketplace may not work cleanly until v0.1.0 is tagged — the exact add-a-custom-repo flow for Marketplace isn't documented publicly as of this writing, so test this one yourself rather than taking this README's word for it.

### Then, either way

1. **Settings → Devices & Services → Add Integration → Get-Rucked**.
2. In the Get-Rucked app: **Profile → Home Assistant → Generate New Token**, then paste the raw token (no `Bearer` prefix — the integration adds that itself) into the setup dialog.

That's it — a "Get-Rucked" device appears with all the sensors below, polling every 15 minutes by default (configurable, minimum 15 minutes, via the integration's **Configure** button).

## Entities

- Latest Ruck Distance (+ date, type, pace, weight, elevation, steps, calories, terrain, rating as attributes)
- Weekly Distance / Monthly Distance (+ session count, minutes, elevation, calories, training load as attributes)
- Fitness (CTL), Fatigue (ATL), Form (TSB) (+ a plain-language label)
- Rank (+ total miles and icon as attributes)
- Distance To Next Rank
- One **Goal: `<title>`** sensor per active goal (percent complete, with the goal's type/target/period as attributes) — these are created and removed automatically as you add or delete goals in the app.

## Errors and re-auth

- An invalid or revoked token triggers Home Assistant's normal re-authentication flow — paste a fresh token from the app and you're back up.
- If your Premium subscription lapses, entities go unavailable and a repair issue explains why (Settings → Repairs). Nothing to do — it clears itself and entities come back automatically once Premium is active again, with the same token.
- Revoking a token in the app and generating a new one for the **same account** does not create a second device — identity is tied to the account, not the token.

## Manual YAML setup

Don't want to use HACS? A YAML-based setup (no custom integration) is also documented at [get-rucked.com/home-assistant](https://www.get-rucked.com/home-assistant).

## Status

Not yet tagged as a release — see the repo's issues/PRs for current state. CI (hassfest, HACS validation, pytest) runs on every push.

No custom icon/logo ships yet. Since Home Assistant 2026.3, a custom integration can ship its own brand images locally (a `brand/` folder inside `custom_components/getrucked/` with `icon.png`/`logo.png`, `@2x` variants, and optional `dark_*` versions) instead of submitting to the [home-assistant/brands](https://github.com/home-assistant/brands) repo — in fact brands-repo submissions for custom integrations are being phased out now that the local option exists. Adding one is a follow-up, not done here.

## Development

```
pip install -r requirements_test.txt
pytest
```

CI runs [hassfest](https://www.home-assistant.io/docs/creating_integration_manifest/), [HACS validation](https://hacs.xyz/docs/publish/integration/), and the test suite on every push and PR.

## License

MIT — see [LICENSE](LICENSE).
