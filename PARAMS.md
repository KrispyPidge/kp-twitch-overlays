# Ledge Watch · Parameter Cheat Sheet

Every scene accepts URL query parameters. Edit the SE widget's **Extra URL params** field (or the direct OBS browser source URL), then **refresh the source**.

## Where to edit

### If you're using SE overlays (recommended):
SE Dashboard → My Overlays → `Ledge Watch · <scene>` → click Custom Widget → edit **Extra URL params** → Save. Then OBS: right-click source → Refresh.

**Don't include the `?`** in the SE field. Just `channel=krispypidgeon&hidegame=1`.

### If the OBS source points directly to GitHub Pages:
Right-click source → Properties → edit URL. E.g.:
```
https://krispypidge.github.io/kp-twitch-overlays/obs/04-in-game.html?channel=krispypidgeon&hidegame=1
```

### Mid-stream without refresh:
Use the `window.*` helpers via a Streamer.bot JS action or OBS "Interact" DevTools console. Listed per scene below.

---

## Cross-scene params (work everywhere)

| Param | Values | Effect |
|---|---|---|
| `channel` | e.g. `krispypidgeon` | Enables live chat + DecAPI polling (viewers, game, title, uptime). Leave empty for sim-only. |
| `palette` | `dawn` · `dusk` · `midnight` | Force a palette. Default auto by clock. |
| `sim` | `0` | Disable simulated chat (auto-off when `channel` is set). |
| `resetTimer` | `1` | One-shot: clears shared timer anchor. Remove after the next load. |

---

## 01 · Starting Soon

| Param | Values | Effect |
|---|---|---|
| `channel` | string | Pre-stream live chat |
| `countdown` | minutes, e.g. `10` | Countdown length (default 5) |
| `sim` | `0` | Disable sim chat |
| `palette` | dawn/dusk/midnight | Force palette |

**Runtime helpers:**
```js
LedgeWatch_test.follow()   // fire a test alert
LedgeWatch.setPalette('midnight')
```

---

## 02 · BRB / 03 · Ending

| Param | Values | Effect |
|---|---|---|
| `channel` | string | Live chat during break / end |
| `sim` | `0` | Disable sim chat |
| `palette` | dawn/dusk/midnight | Force palette |

**Runtime helpers:**
```js
LedgeWatch_test.sub()
LedgeWatch_test.raid()
```

---

## 04 · In-Game HUD

Most configurable scene. Everything can be hidden individually.

| Param | Values | Effect |
|---|---|---|
| `channel` | string | Live chat + live game card + live viewer count + live uptime |
| `hidecam` | `1` | Hide webcam placeholder (use when real webcam source overlays on top) |
| `hidegame` | `1` | **Hide the game/title card entirely** |
| `hidegoal` | `1` | Hide Recon Quota bar |
| `hidechat` | `1` | Hide chat panel |
| `hidetimer` | `1` | Hide UPTIME timer |
| `game` | text | Pin game title (disables auto-update from Twitch) |
| `gameMeta` | text | Pin subtitle line |
| `target` | number | Recon Quota target viewer count (default 50) |
| `targetLabel` | text | Override caption under RECON QUOTA |
| `palette` | dawn/dusk/midnight | Force palette |

**Examples:**
```
hidecam=1&channel=krispypidgeon                         # full HUD, live data
hidecam=1&channel=krispypidgeon&hidegame=1              # no floating game card (when webcam off)
hidecam=1&channel=krispypidgeon&game=MARATHON&gameMeta=day 2 · locked in
hidecam=1&channel=krispypidgeon&hidechat=1&hidegame=1   # stealth mode — just cam + timer + goal
```

**Runtime helpers:**
```js
window.setGame('Marathon', 'hour 2 · locked in')
window.hideGame(true)                  // hide
window.hideGame(false)                 // show again
LedgeWatch_test.sub()
```

---

## 05 · Just Chatting

| Param | Values | Effect |
|---|---|---|
| `channel` | string | Live chat + viewer count + uptime |
| `hidecam` | `1` | Hide webcam placeholder |
| `hidetopic` | `1` | Hide topic card entirely |
| `hidegoal` | `1` | Hide Recon Quota |
| `hidechat` | `1` | Hide chat panel |
| `hidetimer` | `1` | Hide ON AIR timer |
| `topic` | text (HTML allowed) | Topic title — use `<br/>` for line breaks |
| `topicBody` | text | Topic subtitle |
| `topicSize` | `sm` · `md` · `lg` | Title font: 28 / 36 / 44 px |
| `topicWidth` | number (default 420) | Card width in px |
| `target` | number | Recon Quota target (default 50) |
| `palette` | dawn/dusk/midnight | Force palette |

**Examples:**
```
hidecam=1&channel=krispypidgeon&topic=COOP NIGHT&topicSize=lg
hidecam=1&channel=krispypidgeon&topic=LONG TOPIC ABOUT AI SURVEILLANCE&topicSize=sm&topicWidth=520
hidecam=1&channel=krispypidgeon&hidetopic=1             # no topic, just vibes
```

**Runtime helpers:**
```js
window.setTopic('NEW TOPIC<br/>HERE', 'subtitle')
window.setTopicSize('sm')              // sm / md / lg
window.hideTopic(true)                 // hide
window.hideTopic(false)                // show
```

---

## Quick recipes

**"Webcam is off — don't want the floating game card":**
```
hidecam=1&channel=krispypidgeon&hidegame=1
```

**"Just the webcam, all HUD off":**
```
hidecam=1&channel=krispypidgeon&hidegame=1&hidegoal=1&hidechat=1&hidetimer=1
```

**"Long Just Chatting topic title":**
```
hidecam=1&channel=krispypidgeon&topic=FOUR HOURS OF PIGEON CONSPIRACIES&topicSize=sm&topicWidth=500
```

**"Start with 10-min countdown":**
```
channel=krispypidgeon&countdown=10
```

**"Test the look with a specific palette":**
```
channel=krispypidgeon&palette=midnight
```

**"Zero the timer at stream start":**
Add `&resetTimer=1` to one URL → refresh once → remove the param.
Or in DevTools console: `LedgeWatch.resetTimer()`.
