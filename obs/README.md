# KrispyPidgeon · Ledge Watch — OBS Handoff Plan

Purple-dusk surveillance overlay system. 5 scenes + 3 reusable standalone overlays.
Every HTML below is a **1920 × 1080** OBS browser source; stream at 1080p60.

Folder layout:

```
obs/
├── ledge.css                  # shared styles — do not duplicate
├── ledge.js                   # shared JS helpers + postMessage bridge
├── 01-starting-soon.html      # full-screen
├── 02-brb.html                # full-screen
├── 03-ending.html             # full-screen
├── 04-in-game.html            # HUD only, transparent (game capture behind)
├── 05-just-chatting.html      # full-screen (webcam slot centered)
├── 06-alerts-overlay.html     # transparent, alerts only (reusable on any scene)
├── 07-goal-overlay.html       # transparent, goal bar only (reusable)
└── 08-ticker-overlay.html     # transparent, bottom ticker only (reusable)
```

## OBS Scene plan

Each OBS scene is a composition of browser sources + capture sources. Sources listed **bottom → top**.

### Scene 1 · Starting Soon
| # | Source                 | Type            | Path / config                              |
|---|------------------------|-----------------|--------------------------------------------|
| 1 | Starting Soon          | Browser source  | `obs/01-starting-soon.html`, 1920×1080     |
| 2 | BGM / playlist         | Media source    | your lofi playlist                         |

_No webcam, no game capture. 5-minute countdown auto-starts on load (tweak in script)._

### Scene 2 · BRB
| # | Source                 | Type            | Path / config                              |
|---|------------------------|-----------------|--------------------------------------------|
| 1 | BRB                    | Browser source  | `obs/02-brb.html`, 1920×1080               |
| 2 | (optional) Mic mute    | —               | mute mic filter on this scene              |

### Scene 3 · Ending
| # | Source                 | Type            | Path / config                              |
|---|------------------------|-----------------|--------------------------------------------|
| 1 | Ending                 | Browser source  | `obs/03-ending.html`, 1920×1080            |

### Scene 4 · In-Game (main gameplay scene)
Top to bottom order in OBS inspector:

| Layer | Source                        | Type             | Path / config                                                                 |
|-------|-------------------------------|------------------|-------------------------------------------------------------------------------|
| Top   | Ledge Watch · HUD             | Browser source   | `obs/04-in-game.html?hidecam=1`, 1920×1080, transparent                       |
|       | Webcam                        | Video capture    | Position: **x 40, y 130, w 380, h 280** (sits inside HUD's cam frame)         |
|       | Game capture                  | Game capture     | Full-frame                                                                    |
| Bottom| Base (pigeons placeholder)    | (none)           | —                                                                             |

The HUD layer gives you: top strip (REC / CAM / timestamp), goal bar bottom-left, game card under the webcam, uptime top-right, live chat right, ticker along the bottom, and an alert slot that pops top-right. **Pass `?hidecam=1`** so the cam-frame placeholder stays hidden and your real webcam shows through.

### Scene 5 · Just Chatting
| Layer | Source                        | Type             | Path / config                                                                  |
|-------|-------------------------------|------------------|--------------------------------------------------------------------------------|
| Top   | Just Chatting (HUD + BG)      | Browser source   | `obs/05-just-chatting.html?hidecam=1`, 1920×1080                               |
|       | Webcam (big)                  | Video capture    | Position: **x 510, y 110, w 920, h 680**                                       |

Includes rooftop backdrop, topic card top-left (editable via `window.setTopic(...)`), goal + chat + ticker + alerts.

### (Optional) Reusable overlays
Drop these on **any** scene as a top-layer browser source; they're all transparent 1920×1080:
- **`06-alerts-overlay.html`** — only the alert card slot. Use instead of per-scene alerts if you prefer one global alert source that always listens.
- **`07-goal-overlay.html?pct=65`** — only the bread-quota bar. Useful on scenes where you skip the HUD but still want the goal visible.
- **`08-ticker-overlay.html`** — only the scrolling ticker.

## Event wiring (Streamer.bot / custom bot)

Every overlay listens for `postMessage` events from its parent. From Streamer.bot, Chat.bot, or a Twitch PubSub relay, post JSON into the browser source's window:

```js
// follow
overlay.postMessage({ kp: 'alert', type: 'follow', name: 'flock_boss', msg: 'followed the flock' }, '*');

// subscription
overlay.postMessage({ kp: 'alert', type: 'sub', name: 'breadwhisperer',
  amount: 'Tier 3 × 6mo', msg: 'resubbed · 6 months deep' }, '*');

// bits
overlay.postMessage({ kp: 'alert', type: 'bits', name: 'TacticalRalph',
  amount: '500 bits', msg: 'tossed 500 bits' }, '*');

// donation (StreamElements / Ko-fi / etc.)
overlay.postMessage({ kp: 'alert', type: 'donate', name: 'anonymous',
  amount: '$25.00', msg: 'buy yourself a sandwich' }, '*');

// raid
overlay.postMessage({ kp: 'alert', type: 'raid', name: 'Vost0k_stream',
  amount: '42 raiders', msg: 'raiding with 42' }, '*');

// goal progress (0–100)
overlay.postMessage({ kp: 'goal', percent: 72 }, '*');

// chat relay (optional — if you want real chat instead of simulated)
overlay.postMessage({ kp: 'chat', u: 'breadwhisperer', c: '#f0a830', m: 'COO COO' }, '*');
```

### Suggested Streamer.bot actions
| Trigger                  | Action                                                                                 |
|--------------------------|----------------------------------------------------------------------------------------|
| Twitch · Follow          | Execute JS in OBS browser source → post `alert/follow`                                 |
| Twitch · Sub / Resub     | Post `alert/sub` with `amount = {tier} × {months}mo`                                   |
| Twitch · Cheer           | Post `alert/bits` with `amount = {bits} bits`                                          |
| Twitch · Raid            | Post `alert/raid` with `amount = {viewers} raiders`                                    |
| StreamElements · Tip     | Post `alert/donate` with `amount = {currencySymbol}{amount}`                           |
| Sub-goal update          | Post `goal` with `{ percent: (current / target) * 100 }`                               |
| Category change          | `window.setGame('{category}', '{hours} hours logged')` on the In-Game scene            |

### Chat simulation toggle
`04-in-game.html?sim=0` and `05-just-chatting.html?sim=0` disable the fake chat feed — feed real chat via `{kp:'chat'}` instead.

### Debug from OBS inspector
Every scene exposes a `LedgeWatch_test` global. In the OBS browser-source Inspector console:

```js
LedgeWatch_test.sub();
LedgeWatch_test.raid();
LedgeWatch_test.goal(85);
```

## Customising

- **Palette** lives in `ledge.css` `:root` variables. Edit once, every scene updates. Provided palettes in `dusk` (default), `midnight`, `dawn` — copy one set over the `:root` block to swap.
- **Ticker copy** — edit `THOUGHTS` in `ledge.js`, or pass `{ messages: [...] }` to `LedgeWatch.ticker()`.
- **Alert durations** — `setTimeout(..., 7000)` in `ledge.js` `alertHost()`.
- **Positions** — HUD coordinates are explicit in each scene HTML; change them there.
- **Goal title / caption** — pass into `LedgeWatch.goal(root, { title, caption, percent })`.
- **Game / topic cards** — call `window.setGame(...)` / `window.setTopic(...)` from Streamer.bot on category change.

## Asset checklist (things I couldn't make for you)
- Real channel BGM / stinger audio for Starting / BRB / Ending
- Transparent PNG logo if you want one in place of the ransom-note KrispyPidgeon plate
- Webcam mask (feather / chromed frame) if you want softer than the CCTV rectangle

Everything else is code — ship it.
