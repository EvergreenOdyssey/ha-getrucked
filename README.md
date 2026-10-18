# Get-Rucked for Home Assistant

A [HACS](https://hacs.xyz/) custom integration that pulls your [Get-Rucked](https://www.get-rucked.com/) stats — latest ruck, weekly/monthly distance, goals, training load (CTL/ATL/TSB), and rank — into Home Assistant. Requires an active **Get-Rucked Premium** subscription.

## Install via HACS

1. In HACS, add this repository as a **custom repository**: `EvergreenOdyssey/ha-getrucked` (category: Integration).
2. Install **Get-Rucked**, then restart Home Assistant.
3. **Settings → Devices & Services → Add Integration → Get-Rucked**.
4. In the Get-Rucked app: **Profile → Home Assistant → Generate New Token**, then paste the raw token (no `Bearer` prefix — the integration adds that itself) into the setup dialog.

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

## Development

```
pip install -r requirements_test.txt
pytest
```

CI runs [hassfest](https://www.home-assistant.io/docs/creating_integration_manifest/), [HACS validation](https://hacs.xyz/docs/publish/integration/), and the test suite on every push and PR.

## License

MIT — see [LICENSE](LICENSE).
