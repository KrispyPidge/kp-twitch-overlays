# StreamElements + OBS.Live setup

One SE overlay per scene. Each overlay contains a single Custom Widget
that loads the corresponding Ledge Watch scene from GitHub Pages and
forwards SE events to it.

## 1 — Create the SE overlay

1. Go to <https://streamelements.com/dashboard/overlays> → **New Overlay**
2. Size: **1920 × 1080**, name it e.g. `Ledge Watch · In-Game`
3. In the editor, **Add Widget → Static/Custom → Custom Widget**
4. Open the widget's code editor (the `< >` icon on the widget)

## 2 — Paste the four files

| Tab in SE editor | File |
|---|---|
| HTML            | `widget.html` |
| CSS             | `widget.css`  |
| JS              | `widget.js`   |
| Fields (JSON)   | `fields.json` |
| Data            | leave empty |

Click **Save**.

## 3 — Set the scene

In the widget's **Fields** panel (right side of editor):
- `Scene slug` → one of:
  - `01-starting-soon`
  - `02-brb`
  - `03-ending`
  - `04-in-game`
  - `05-just-chatting`
  - `06-alerts-overlay`
  - `07-goal-overlay`
  - `08-ticker-overlay`
- `Extra URL params` → optional. Examples:
  - `hidecam=1` for `04-in-game` and `05-just-chatting` (so real webcam shows through)
  - `palette=midnight` to force a palette (otherwise auto-switches by time of day)

Save. You should see the scene preview inside the SE editor.

## 4 — Test it (without going live)

In the SE editor's preview, open the browser DevTools console and run:

```js
LedgeBridge_test.sub();
LedgeBridge_test.prime();
LedgeBridge_test.bits();
LedgeBridge_test.tip();
LedgeBridge_test.raid();
LedgeBridge_test.goal(85);
```

Each should fire an on-screen alert in the expected style.

## 5 — Wire to OBS.Live

1. Open OBS. Add a new **Browser source** using **OBS.Live**'s overlay picker
2. Select the overlay you just created
3. Size: 1920 × 1080. Interact → Refresh once after adding
4. **For In-Game scene**: add your real webcam capture on top, positioned at
   `x=40, y=130, 380×280` (per `obs/README.md`)
5. **For Just Chatting**: webcam at `x=510, y=110, 920×680`

## 6 — Repeat for each scene

Duplicate the SE overlay (Dashboard → My Overlays → **⋯ → Clone**) for each
Ledge Watch scene you want, and change the `Scene slug` field.

Minimum set: 01, 02, 03, 04, 05. The "overlay only" variants (06/07/08) are
for when you want to drop just one component onto an arbitrary scene.

## Troubleshooting

- **Iframe blank** — GitHub Pages may still be deploying. Wait 1–2 min after
  first push and hit the overlay URL directly:
  <https://krispypidge.github.io/kp-twitch-overlays/obs/04-in-game.html>
- **No alerts firing live** — test via `LedgeBridge_test.*()` first to rule out
  iframe/bridge issues. Then check SE's event log for missing events.
- **Prime subs still missing** — check the SE event payload shape with
  `console.debug` inside `onEventReceived`. If SE sends something exotic,
  adjust `resolveTier()` in `widget.js`.
- **Updating the overlay code** — edit the files in this repo, push to main,
  hard-refresh the OBS source (right click → Refresh). GitHub Pages auto-deploys.
