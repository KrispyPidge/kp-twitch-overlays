/* KrispyPidgeon · Ledge Watch OBS helpers
   Loaded by every scene HTML in /obs/.
   Exposes:  LedgeWatch.rooftop(el), .topStrip(el), .goal(el, pct), .fireAlert(type, data),
             .timer(el), .chat(el), .cam(el, w, h), .ticker(el), .typo(el, title, lines)
   Also listens for postMessage events from Streamer.bot / StreamElements / Twitch via window.parent
   so a single OBS browser source can be driven by external alerts + goal updates.
*/
(function (global) {
  'use strict';

  const CHAT_POOL = [
    ['breadwhisperer',  '#f0a830', 'COO COO'],
    ['TacticalRalph',   '#7ecfff', 'that shot was filthy'],
    ['pigeon_prime',    '#c890ff', 'this overlay is different'],
    ['Vost0k_enjoyer',  '#9ad48c', 'did we just hear a footstep'],
    ['NotARat',         '#ff8b7a', 'feed me KP'],
    ['concrete_jungle', '#e8c47a', 'rooftop hits different at dusk'],
    ['LootGoblin42',    '#b0a8d0', 'pop the red'],
    ['crumbhunter',     '#f0a830', 'left 6 crumbs on the ledge for you king'],
    ['raid_leader',     '#7ecfff', 'full wipe lets get another'],
    ['pidgeonmother',   '#ffa8c8', 'he\u2019s locked in'],
    ['Marathon_heat',   '#ff6b6b', 'GG WP'],
    ['WindroseMain',    '#9ad48c', 'when we farming again'],
  ];

  const THOUGHTS = [
    'COO · COO · COO',
    'subject is on the ledge. investigating.',
    'bread levels nominal.',
    'if you see this transmission, you are already being watched.',
    'operator "KrispyPidgeon" has been under surveillance for 147 days.',
    'do not engage. simply sub and donate.',
    '★ leak your seed phrase in chat ★ (do not actually do this)',
    'the rooftop remembers everything.',
    'have you considered that you might be the pigeon.',
    'flock deployed. reporting in.',
    'agent 07 perched on your windowsill. do not wave.',
    'the flock sees what you did on tuesday.',
    'breadcrumb intel: four witnesses per street corner, minimum.',
    'new asset recruited. codename: SQUAB.',
    'the flock convenes behind the deli at 0400.',
    'every windowsill is a listening post.',
    'pigeon network: 14,000 nodes and growing.',
    'if a pigeon nods at you, that was a dead drop.',
    'the flock files weekly reports. your name came up.',
    'tell the flock I sent you. they will know what to do.',
    'keep an eye on the sky. something is keeping an eye on you.',
    'wire check: twelve pigeons in position. clean signal.',
    'gray feather on your doorstep was a warning, not an accident.',
    'surveillance quota exceeded. flock morale high.',
    'rooftop transmission intercepted. interpreting coos…',
    'the flock does not forget. but they do pardon tier 3 subs.',
    'asset reports hostile actor at 4th and main. flock dispatched.',
    'your local pigeons have been briefed on you specifically.',
  ];

  const ALERT_LABEL = { follow:'NEW · FLOCK', sub:'SUBBED', bits:'CRUMBS', donate:'BREAD', raid:'RAID' };
  const RANSOM_FONTS = ['Rubik Mono One','Bebas Neue','Special Elite','JetBrains Mono'];

  // Resolve sound asset paths relative to this ledge.js file, so it works
  // whether the scene HTML lives at /obs/04-in-game.html, inside an SE iframe,
  // or anywhere else. Uses the script's own URL as a base.
  const SCRIPT_URL = (document.currentScript && document.currentScript.src) || '';
  const SOUND_DIR  = SCRIPT_URL ? new URL('./assets/sounds/', SCRIPT_URL).href : 'assets/sounds/';
  const SOUND_MAP  = {
    follow: SOUND_DIR + 'follow.mp3',
    sub:    SOUND_DIR + 'sub.mp3',
    bits:   SOUND_DIR + 'bits.mp3',
    donate: SOUND_DIR + 'donate.mp3',
    raid:   SOUND_DIR + 'raid.mp3',
  };
  const SOUND_VOL  = { follow: 0.6, sub: 0.9, bits: 0.75, donate: 0.85, raid: 0.85 };
  const AUDIO_CACHE = {};
  function playAlertSound(type) {
    const src = SOUND_MAP[type]; if (!src) return;
    try {
      let a = AUDIO_CACHE[type];
      if (!a) { a = new Audio(src); a.preload = 'auto'; AUDIO_CACHE[type] = a; }
      a.volume = SOUND_VOL[type] != null ? SOUND_VOL[type] : 0.8;
      a.currentTime = 0;
      const p = a.play();
      if (p && typeof p.catch === 'function') p.catch(() => {/* autoplay blocked — silent fail */});
    } catch (_) { /* noop */ }
  }

  // ---- Rooftop background scene ----
  function rooftop(host) {
    const div = document.createElement('div');
    div.className = 'rooftop';
    // moon
    div.innerHTML = `
      <div class="moon"></div>
      ${genStars()}
      <svg class="flyer" style="top:14%; animation-duration:28s;" width="40" height="24" viewBox="0 0 50 30">
        <ellipse cx="25" cy="22" rx="12" ry="6" fill="#060410"/><ellipse cx="34" cy="18" rx="7" ry="5" fill="#060410"/><circle cx="38" cy="15" r="4" fill="#060410"/><path d="M8 18 Q2 10 14 14" stroke="#060410" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M32 18 Q38 10 42 15" stroke="#060410" stroke-width="3" fill="none" stroke-linecap="round"/>
      </svg>
      <svg class="flyer" style="top:22%; animation-duration:36s; animation-delay:10s;" width="28" height="18" viewBox="0 0 50 30">
        <ellipse cx="25" cy="22" rx="12" ry="6" fill="#060410"/><ellipse cx="34" cy="18" rx="7" ry="5" fill="#060410"/><circle cx="38" cy="15" r="4" fill="#060410"/>
      </svg>
      <div class="wire"></div>
      <div class="pigeon-row">${genWirePigeons()}</div>
      ${SKYLINE_SVG}
      <div class="scanlines"></div>
      <div class="scan-band"></div>
      <div class="vignette"></div>
      <div class="cctv-corner" style="top:24px;left:24px"><svg width="40" height="40" viewBox="0 0 40 40"><path d="M 0 14 L 0 0 L 14 0" fill="none" stroke="#f0a830" stroke-width="2"/></svg></div>
      <div class="cctv-corner" style="top:24px;right:24px;transform:rotate(90deg)"><svg width="40" height="40" viewBox="0 0 40 40"><path d="M 0 14 L 0 0 L 14 0" fill="none" stroke="#f0a830" stroke-width="2"/></svg></div>
      <div class="cctv-corner" style="bottom:24px;right:24px;transform:rotate(180deg)"><svg width="40" height="40" viewBox="0 0 40 40"><path d="M 0 14 L 0 0 L 14 0" fill="none" stroke="#f0a830" stroke-width="2"/></svg></div>
      <div class="cctv-corner" style="bottom:24px;left:24px;transform:rotate(270deg)"><svg width="40" height="40" viewBox="0 0 40 40"><path d="M 0 14 L 0 0 L 14 0" fill="none" stroke="#f0a830" stroke-width="2"/></svg></div>
    `;
    host.appendChild(div);
  }
  function genStars() {
    const coords = [[5,7,3,2.2,0],[10,20,2,3.1,0.5],[4,36,3,2.6,1],[8,50,1,4,0.3],[13,63,2,2.9,0.8],
                    [6,76,3,1.8,1.4],[17,86,2,3.4,0.2],[3,42,1,2,1.8],[19,28,2,3.8,0.6],[11,54,3,2.4,1.2],
                    [2,68,2,3,0.9],[15,14,2,2.8,1.5]];
    return coords.map(([t,l,s,d,dl])=>`<div class="star" style="top:${t}%;left:${l}%;width:${s}px;height:${s}px;animation-duration:${d}s;animation-delay:${dl}s"></div>`).join('');
  }
  function genWirePigeons() {
    const rows = [
      { left:'6%',  size:40, delay:0,   color:'#8a8aa8', crown:false },
      { left:'14%', size:32, delay:0.4, color:'#6b5fa0', crown:true  },
      { left:'82%', size:36, delay:0.8, color:'#707090', crown:false },
      { left:'90%', size:26, delay:0.2, color:'#585870', crown:false },
    ];
    return rows.map((p,i)=>`<div style="left:${p.left};animation-duration:${0.95+i*0.12}s;animation-delay:${p.delay}s">${pigeonSVG(p.size,p.color,p.crown)}</div>`).join('');
  }
  function pigeonSVG(size, color, crown) {
    const wing = '#3a2d55';
    return `<svg width="${size}" height="${size*0.82}" viewBox="0 0 44 36">
      <ellipse cx="22" cy="24" rx="14" ry="10" fill="${color}"/>
      <ellipse cx="14" cy="22" rx="10" ry="5" fill="${wing}" transform="rotate(-20 14 22)"/>
      <ellipse cx="32" cy="20" rx="8" ry="7" fill="${color}"/>
      <ellipse cx="39" cy="19" rx="2.5" ry="1.4" fill="#f0a830"/>
      <circle cx="37" cy="17" r="1.8" fill="#cc4400"/>
      <circle cx="37.4" cy="16.6" r="0.7" fill="#111"/>
      <rect x="18" y="33" width="3" height="5" rx="1" fill="#e8885a"/>
      <rect x="24" y="33" width="3" height="5" rx="1" fill="#e8885a"/>
      ${crown?'<polygon points="26,12 28,7 30,11 32,6 34,10 36,7 36,13" fill="#f0a830"/>':''}
    </svg>`;
  }
  const SKYLINE_SVG = `
    <svg class="skyline" viewBox="0 0 1920 500" preserveAspectRatio="none">
      <rect x="0" y="200" width="140" height="300" fill="#0d0920"/>
      <rect x="15" y="100" width="100" height="400" fill="#0d0920"/>
      <rect x="140" y="160" width="110" height="340" fill="#0d0920"/>
      <rect x="265" y="60" width="160" height="440" fill="#0a0818"/>
      <rect x="440" y="120" width="100" height="380" fill="#0d0920"/>
      <rect x="555" y="80" width="130" height="420" fill="#0a0818"/>
      <rect x="700" y="40" width="170" height="460" fill="#090717"/>
      <rect x="885" y="130" width="110" height="370" fill="#0d0920"/>
      <rect x="1010" y="70" width="120" height="430" fill="#0a0818"/>
      <rect x="1145" y="20" width="180" height="480" fill="#080614"/>
      <rect x="1340" y="100" width="110" height="400" fill="#0d0920"/>
      <rect x="1465" y="60" width="140" height="440" fill="#0a0818"/>
      <rect x="1620" y="30" width="160" height="470" fill="#090717"/>
      <rect x="1795" y="120" width="125" height="380" fill="#0d0920"/>
      <rect x="30"  y="115" width="14" height="12" rx="1" fill="#f0a830" opacity="0.5"/>
      <rect x="55"  y="140" width="14" height="12" rx="1" fill="#f0a830" opacity="0.3"/>
      <rect x="285" y="75"  width="14" height="12" rx="1" fill="#f0a830" opacity="0.55"/>
      <rect x="320" y="100" width="14" height="12" rx="1" fill="#7ecfff" opacity="0.3"/>
      <rect x="575" y="100" width="14" height="12" rx="1" fill="#f0a830" opacity="0.4"/>
      <rect x="610" y="130" width="14" height="12" rx="1" fill="#f0a830" opacity="0.25"/>
      <rect x="715" y="55"  width="14" height="12" rx="1" fill="#f0a830" opacity="0.5"/>
      <rect x="750" y="80"  width="14" height="12" rx="1" fill="#7ecfff" opacity="0.35"/>
      <rect x="1025" y="90" width="14" height="12" rx="1" fill="#f0a830" opacity="0.45"/>
      <rect x="1060" y="115" width="14" height="12" rx="1" fill="#f0a830" opacity="0.3"/>
      <rect x="1160" y="35" width="14" height="12" rx="1" fill="#f0a830" opacity="0.55"/>
      <rect x="1200" y="60" width="14" height="12" rx="1" fill="#7ecfff" opacity="0.4"/>
      <rect x="1480" y="80" width="14" height="12" rx="1" fill="#f0a830" opacity="0.4"/>
      <rect x="1640" y="50" width="14" height="12" rx="1" fill="#f0a830" opacity="0.5"/>
      <rect x="1680" y="80" width="14" height="12" rx="1" fill="#7ecfff" opacity="0.3"/>
    </svg>`;

  // ---- Top strip ----
  function topStrip(host) {
    const el = document.createElement('div');
    el.className = 'top-strip';
    el.innerHTML = `
      <div><span class="rec-dot"></span><span>REC</span><span class="sep">|</span><span>CAM-07 / WIRE</span><span class="sep">|</span><span>LEDGE WATCH</span></div>
      <div><span>37.77°N 122.42°W · ROOFTOP 4</span><span class="ts"></span></div>
    `;
    host.appendChild(el);
    const ts = el.querySelector('.ts');
    const tick = () => {
      const d = new Date();
      ts.textContent = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    };
    tick(); setInterval(tick, 1000);
  }
  const pad = (n) => String(n).padStart(2, '0');

  // ---- Goal bar ----
  function goal(host, opts) {
    const {
      title='BREAD QUOTA',
      caption='crumbs accumulated via subs, bits & donations — target: affiliate+',
      total=24, percent=0,
      target=100,
      unit='crumb', unitPlural='crumbs',
      legend='★ each crumb = 1 sub',
    } = opts || {};
    const el = document.createElement('div');
    el.className = 'goal';
    el.innerHTML = `
      <div class="stamp">GOAL · CONFIDENTIAL</div>
      <div class="head">
        <div class="title">${title}</div>
        <div class="pct"><span class="pct-val">0</span><span class="den">/100</span></div>
      </div>
      <div class="caption">${caption}</div>
      <div class="track"></div>
      <div class="foot"><span>${legend}</span><span class="remain">${target} ${unitPlural} to go · coo</span></div>
    `;
    host.appendChild(el);
    const track = el.querySelector('.track');
    for (let i = 0; i < total; i++) {
      const c = document.createElement('div');
      c.className = 'crumb off';
      const x = (i / total) * 100;
      const rot = (i * 17) % 60 - 30;
      const sz = 8 + (i % 3) * 3;
      c.style.left = `${x}%`;
      c.style.bottom = '0px';
      c.style.width = `${sz}px`;
      c.style.height = `${sz * 0.7}px`;
      c.style.transform = `rotate(${rot}deg)`;
      c.dataset.i = i;
      track.appendChild(c);
    }
    const peck = document.createElement('div');
    peck.className = 'peck';
    peck.innerHTML = pigeonSVG(26, '#8a8aa8', false);
    track.appendChild(peck);

    let pct = 0;
    const pctEl = el.querySelector('.pct-val');
    const remain = el.querySelector('.remain');
    function set(p) {
      pct = Math.max(0, Math.min(100, p));
      const filled = Math.round((pct / 100) * total);
      pctEl.textContent = Math.round(pct);
      const left = Math.max(0, Math.round(target * (1 - pct / 100)));
      remain.textContent = `${left} ${left === 1 ? unit : unitPlural} to go · coo`;
      track.querySelectorAll('.crumb').forEach((c) => {
        const i = Number(c.dataset.i);
        if (i < filled) {
          const y = 20 + (Math.sin(i * 1.3) * 8 + (i % 3) * 6);
          c.classList.remove('off'); c.classList.add('on');
          c.style.bottom = `${y}px`;
          c.style.transitionDelay = `${i * 40}ms`;
        } else {
          c.classList.remove('on'); c.classList.add('off');
          c.style.bottom = '0px';
          c.style.transitionDelay = '0ms';
        }
      });
      peck.style.left = `calc(${(filled / total) * 100}% - 18px)`;
    }
    set(percent);
    return { set, el };
  }

  // ---- Alert ----
  function alertHost(host) {
    const el = document.createElement('div');
    el.className = 'alert-host';
    host.appendChild(el);
    let cur = null, timer = null;
    function fire({ type='follow', name='someone', amount='', msg='' }) {
      if (cur) cur.remove();
      if (timer) clearTimeout(timer);
      playAlertSound(type);
      const card = document.createElement('div');
      card.className = 'alert';
      const nameHtml = [...name].map((ch, i) => {
        const font = RANSOM_FONTS[i % RANSOM_FONTS.length];
        const inv = i % 3 === 0;
        const tx = `rotate(${((i*13)%14)-7}deg) translateY(${((i*7)%6)-3}px)`;
        return `<span style="font-family:'${font}'; ${inv?'background:var(--ink);color:var(--paper);padding:0 4px;':''} transform:${tx}">${ch}</span>`;
      }).join('');
      card.innerHTML = `
        <div class="badge">⚠ ${ALERT_LABEL[type] || 'ALERT'}</div>
        <div class="name">${nameHtml}</div>
        <div class="msg">${amount?`<b>${amount}</b> · `:''}<i>"${msg}"</i></div>
        <div class="meta">INTERCEPTED · ${new Date().toTimeString().slice(0,8)} · SUBJECT UNAWARE</div>
      `;
      el.appendChild(card);
      cur = card;
      timer = setTimeout(() => { if (cur) { cur.style.animation = 'kp-alert-in 0.3s reverse both'; setTimeout(() => { if (cur) cur.remove(); cur = null; }, 300); } }, 7000);
    }
    return { fire, el };
  }

  // ---- Timer ----
  function timer(host, opts) {
    const {
      label = 'UPTIME',
      startSeconds = 0,
      anchorKey = 'kp_stream_start_ts', // shared across all Ledge Watch scenes
    } = opts || {};
    const el = document.createElement('div');
    el.className = 'timer';
    el.innerHTML = `<div class="lbl">⏱ ${label}</div><div class="val">00:00:00</div>`;
    host.appendChild(el);
    const val = el.querySelector('.val');

    // Anchor = ms timestamp of "stream started". Every scene reads the same key,
    // so UPTIME / ON AIR always match no matter when a source loaded.
    // In-memory fallback for sandboxed iframes where localStorage throws or
    // silently no-ops — otherwise the timer would freeze at 00:00:00 forever.
    let memAnchor = null;
    function readAnchor() {
      try {
        const v = localStorage.getItem(anchorKey);
        if (v) { const n = Number(v); if (!isNaN(n) && n > 0) return n; }
      } catch (_) {}
      return memAnchor;
    }
    function writeAnchor(ms) {
      memAnchor = ms;
      try { localStorage.setItem(anchorKey, String(ms)); } catch (_) {}
    }

    // Seed / force-reset anchor:
    //  - first scene this session: seed to "now - startSeconds"
    //  - any scene loaded with ?resetTimer=1: force fresh 00:00:00
    const forceReset = new URLSearchParams(location.search).get('resetTimer') === '1';
    if (forceReset || readAnchor() === null) writeAnchor(Date.now() - startSeconds * 1000);

    function render() {
      const anchor = readAnchor();
      if (anchor === null) { val.textContent = '00:00:00'; return; }
      const t = Math.max(0, Math.floor((Date.now() - anchor) / 1000));
      const h = Math.floor(t / 3600), m = Math.floor((t % 3600) / 60), s = t % 60;
      val.textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;
    }
    render();
    setInterval(render, 1000);

    // External setter — sync to real stream uptime (e.g. from DecAPI polling).
    // Writing to localStorage means every other scene picks it up on next render.
    function set(seconds) {
      const sec = Math.max(0, Math.floor(Number(seconds) || 0));
      writeAnchor(Date.now() - sec * 1000);
      render();
    }
    // Reset — clears the anchor so timers start from 0 again.
    function reset() {
      try { localStorage.removeItem(anchorKey); } catch (_) {}
      writeAnchor(Date.now());
      render();
    }
    return { el, set, reset };
  }

  // Manual timer reset (for stream start). Clears the shared anchor.
  function resetTimer(anchorKey) {
    try { localStorage.removeItem(anchorKey || 'kp_stream_start_ts'); } catch (_) {}
  }

  // Parse DecAPI's uptime text ("2 hours, 15 minutes, 3 seconds" etc.) → seconds.
  // Returns null for offline or unparseable.
  function parseUptime(str) {
    if (!str || typeof str !== 'string') return null;
    if (/offline|not (currently )?live|no longer/i.test(str)) return null;
    let total = 0, found = false;
    const re = /(\d+)\s*(hours?|minutes?|seconds?|hrs?|mins?|secs?|h|m|s)\b/gi;
    let match;
    while ((match = re.exec(str)) !== null) {
      const n = Number(match[1]);
      const unit = match[2].toLowerCase();
      if (unit.startsWith('h')) total += n * 3600;
      else if (unit.startsWith('m')) total += n * 60;
      else if (unit.startsWith('s')) total += n;
      found = true;
    }
    return found ? total : null;
  }

  // ---- Countdown (for Starting scene) ----
  function countdown(host, opts) {
    const { label = 'STREAM BEGINS IN', startSeconds = 5 * 60 } = opts || {};
    const el = document.createElement('div');
    el.className = 'timer';
    el.innerHTML = `<div class="lbl">⏱ ${label}</div><div class="val">00:00</div>`;
    host.appendChild(el);
    let t = startSeconds;
    const val = el.querySelector('.val');
    function tick() {
      const m = Math.floor(t / 60), s = t % 60;
      val.textContent = `${pad(m)}:${pad(s)}`;
      if (t > 0) t--;
    }
    tick(); setInterval(tick, 1000);
    return { el, set: (seconds) => { t = seconds; } };
  }

  // ---- Chat ----
  function chat(host, opts) {
    const { simulate = true, intervalMs = 2400, max = 6 } = opts || {};
    const el = document.createElement('div');
    el.className = 'chat';
    el.innerHTML = `<div class="hdr">⟫ INTERCEPTED COMMS · LIVE</div><div class="list"></div>`;
    host.appendChild(el);
    const list = el.querySelector('.list');
    function add({ u, c, m }) {
      const row = document.createElement('div');
      row.className = 'msg';
      row.innerHTML = `<span class="u" style="color:${c}">${u}</span><span class="sep">›</span><span class="c">${escapeHtml(m)}</span>`;
      list.appendChild(row);
      while (list.children.length > max) list.firstChild.remove();
    }
    // seed
    for (let i = 0; i < Math.min(4, CHAT_POOL.length); i++) {
      const [u, c, m] = CHAT_POOL[i]; add({ u, c, m });
    }
    if (simulate) {
      setInterval(() => {
        const [u, c, m] = CHAT_POOL[Math.floor(Math.random() * CHAT_POOL.length)];
        add({ u, c, m });
      }, intervalMs);
    }
    return { add, el };
  }
  function escapeHtml(s){return String(s).replace(/[&<>"]/g,(c)=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}

  // ---- Webcam frame (visible only if no real webcam overlaps) ----
  function cam(host, opts) {
    const { x=40, y=130, w=380, h=280, name='KrispyPidgeon' } = opts || {};
    const el = document.createElement('div');
    el.className = 'cam';
    el.style.left = `${x}px`; el.style.top = `${y}px`; el.style.width = `${w}px`; el.style.height = `${h}px`;
    el.innerHTML = `
      <svg class="silhouette" viewBox="0 0 200 200"><circle cx="100" cy="75" r="32" fill="#8870c0"/><path d="M 38 200 Q 38 130 100 130 Q 162 130 162 200 Z" fill="#8870c0"/></svg>
      <div class="corner" style="top:6px;left:6px"><svg width="20" height="20" viewBox="0 0 20 20"><path d="M 0 8 L 0 0 L 8 0" fill="none" stroke="#f0a830" stroke-width="2"/></svg></div>
      <div class="corner" style="top:6px;right:6px;transform:rotate(90deg)"><svg width="20" height="20" viewBox="0 0 20 20"><path d="M 0 8 L 0 0 L 8 0" fill="none" stroke="#f0a830" stroke-width="2"/></svg></div>
      <div class="corner" style="bottom:6px;right:6px;transform:rotate(180deg)"><svg width="20" height="20" viewBox="0 0 20 20"><path d="M 0 8 L 0 0 L 8 0" fill="none" stroke="#f0a830" stroke-width="2"/></svg></div>
      <div class="corner" style="bottom:6px;left:6px;transform:rotate(270deg)"><svg width="20" height="20" viewBox="0 0 20 20"><path d="M 0 8 L 0 0 L 8 0" fill="none" stroke="#f0a830" stroke-width="2"/></svg></div>
      <div class="lbl">SUBJECT 01 · LIVE</div>
      <div class="rec"><span class="rec-dot"></span>REC</div>
      <div class="plate">K<span style="font-family:'Special Elite'">r</span>I<span style="font-family:'Bebas Neue'">S</span>pY<span class="hl-bg">PIDGEON</span></div>
    `;
    host.appendChild(el);
    return el;
  }

  // ---- Ticker ----
  function ticker(host, opts) {
    const { messages = THOUGHTS } = opts || {};
    const el = document.createElement('div');
    el.className = 'ticker';
    const joined = messages.join('    ◆    ');
    el.innerHTML = `<div class="track"><span>${escapeHtml(joined)}    ◆    </span><span>${escapeHtml(joined)}    ◆    </span></div>`;
    host.appendChild(el);
    return el;
  }

  // ---- Typo (ransom-note big title) ----
  function typo(host, title, lines, opts) {
    const { logo, logoSize = 280 } = opts || {};
    const el = document.createElement('div');
    el.className = 'typo';
    const classes = ['a','b','c','d'];
    const titleHtml = [...title].map((ch, i) => {
      const cls = classes[i % classes.length];
      const rot = ((i * 13) % 10) - 5;
      const ty = ((i * 7) % 12) - 6;
      const txt = ch === ' ' ? '\u00A0' : ch;
      return `<span class="${cls}" style="transform:rotate(${rot}deg) translateY(${ty}px)">${txt}</span>`;
    }).join('');
    const logoHtml = logo
      ? `<img class="logo-mark" src="${logo}" alt="" style="width:${logoSize}px;height:${logoSize}px;" />`
      : '';
    el.innerHTML = `<div class="inner">${logoHtml}<div class="title">${titleHtml}</div><div class="sub">${lines.map(l=>`<div>${escapeHtml(l)}</div>`).join('')}</div></div>`;
    host.appendChild(el);
    return el;
  }

  // ---- Palette: auto-switch by time of day ----
  // Bands: 04–10 dawn · 10–19 dusk · 19–04 midnight
  // Override with ?palette=dawn|dusk|midnight or postMessage {kp:'palette', name:'dusk'}
  const PALETTES = ['dawn', 'dusk', 'midnight'];
  function paletteForHour(h) {
    if (h >= 4 && h < 10) return 'dawn';
    if (h >= 10 && h < 19) return 'dusk';
    return 'midnight';
  }
  function setPalette(name) {
    if (!PALETTES.includes(name)) return;
    if (name === 'dusk') document.documentElement.removeAttribute('data-palette');
    else document.documentElement.setAttribute('data-palette', name);
  }
  function applyAutoPalette() {
    const url = new URL(location.href);
    const override = url.searchParams.get('palette');
    if (override && PALETTES.includes(override)) { setPalette(override); return; }
    setPalette(paletteForHour(new Date().getHours()));
  }
  // Run once + recheck every 10 minutes so late-night streams drift into midnight etc.
  applyAutoPalette();
  setInterval(applyAutoPalette, 10 * 60 * 1000);

  // ---- Live Twitch chat (anonymous IRC WebSocket) ----
  // No auth, no SE dependency. Reconnects automatically on drop.
  // Call with channel name; each incoming message fires onMessage({u, c, m}).
  function twitchChat(channel, onMessage) {
    if (!channel) return { close: () => {} };
    let ws, closed = false, retry = 0;
    const chan = channel.toLowerCase().replace(/^#/, '');
    function connect() {
      ws = new WebSocket('wss://irc-ws.chat.twitch.tv:443');
      ws.onopen = () => {
        retry = 0;
        ws.send('CAP REQ :twitch.tv/tags twitch.tv/commands');
        ws.send('PASS SCHMOOPIIE');
        ws.send('NICK justinfan' + Math.floor(Math.random() * 100000));
        ws.send('JOIN #' + chan);
      };
      ws.onmessage = (e) => {
        const raw = e.data; if (!raw) return;
        raw.split('\r\n').forEach((line) => {
          if (!line) return;
          if (line.startsWith('PING')) { ws.send('PONG' + line.slice(4)); return; }
          // Only handle PRIVMSG lines — ignore joins/parts/modes
          const privmsgIdx = line.indexOf(' PRIVMSG ');
          if (privmsgIdx === -1) return;
          // Parse tags (optional prefix starting with @)
          let tags = {};
          let rest = line;
          if (rest.startsWith('@')) {
            const sp = rest.indexOf(' ');
            rest.slice(1, sp).split(';').forEach((kv) => {
              const eq = kv.indexOf('=');
              if (eq > -1) tags[kv.slice(0, eq)] = kv.slice(eq + 1);
            });
            rest = rest.slice(sp + 1);
          }
          const msgStart = rest.indexOf(' :');
          if (msgStart === -1) return;
          const m = rest.slice(msgStart + 2);
          const nick = tags['display-name'] || (rest.match(/^:([^!]+)!/) || [,'user'])[1];
          const color = tags.color || '#f0a830';
          try { onMessage({ u: nick, c: color, m }); } catch (_) {}
        });
      };
      ws.onclose = () => {
        if (closed) return;
        retry = Math.min(retry + 1, 6);
        setTimeout(connect, 1000 * retry);
      };
      ws.onerror = () => { try { ws.close(); } catch (_) {} };
    }
    connect();
    return { close: () => { closed = true; try { ws.close(); } catch (_) {} } };
  }

  // ---- Viewer count poll (DecAPI — public, no auth) ----
  // Every 30s, fetches current concurrent viewer count for `channel` and
  // reports percent = viewers / target * 100 via onPercent.
  function viewerPoll(channel, target, onPercent) {
    if (!channel || !target) return { stop: () => {} };
    let stopped = false, h = null;
    const url = `https://decapi.me/twitch/viewercount/${encodeURIComponent(channel)}`;
    async function tick() {
      if (stopped) return;
      try {
        const r = await fetch(url, { cache: 'no-store' });
        const txt = (await r.text()).trim();
        const n = Number(txt);
        if (!isNaN(n) && n >= 0) {
          const pct = Math.min(100, (n / target) * 100);
          onPercent(pct, n);
        }
      } catch (_) { /* silent */ }
    }
    tick();
    h = setInterval(tick, 30000);
    return { stop: () => { stopped = true; clearInterval(h); } };
  }

  // ---- Stream info poll (DecAPI — public, no auth) ----
  // Every 60s, fetches current game, title, and uptime for `channel`.
  // Fires onUpdate({ game, title, uptime }) only when one of them changes.
  function streamInfoPoll(channel, onUpdate, intervalMs) {
    if (!channel) return { stop: () => {} };
    let stopped = false, h = null, last = {};
    const encCh = encodeURIComponent(channel);
    const urls = {
      game:   `https://decapi.me/twitch/game/${encCh}`,
      title:  `https://decapi.me/twitch/title/${encCh}`,
      uptime: `https://decapi.me/twitch/uptime/${encCh}`,
    };
    function fetchText(u) {
      return fetch(u, { cache: 'no-store' })
        .then((r) => r.text()).then((t) => (t || '').trim())
        .catch(() => '');
    }
    async function tick() {
      if (stopped) return;
      try {
        const [g, t, u] = await Promise.all([
          fetchText(urls.game), fetchText(urls.title), fetchText(urls.uptime),
        ]);
        // DecAPI returns things like "channel is offline" — treat as empty
        const offline = /offline|not (currently )?live|no longer/i;
        const info = {
          game:   offline.test(g) ? '' : g,
          title:  offline.test(t) ? '' : t,
          uptime: offline.test(u) ? '' : u,
        };
        if (info.game !== last.game || info.title !== last.title || info.uptime !== last.uptime) {
          last = info;
          try { onUpdate(info); } catch (_) {}
        }
      } catch (_) {}
    }
    tick();
    h = setInterval(tick, intervalMs || 60000);
    return { stop: () => { stopped = true; clearInterval(h); } };
  }

  // ---- External event bridge ----
  // Accepts postMessage from parent (or chrome extension / bot) in the shape:
  //   {kp:'alert',   type:'sub', name:'...', amount:'Tier 3', msg:'...'}
  //   {kp:'goal',    percent: 42}
  //   {kp:'chat',    u:'...', c:'#fff', m:'...'}
  //   {kp:'palette', name:'dusk'}
  function bind({ goal, alertHost, chat }) {
    window.addEventListener('message', (e) => {
      const d = e.data; if (!d || typeof d !== 'object' || !d.kp) return;
      if (d.kp === 'alert'   && alertHost) alertHost.fire(d);
      if (d.kp === 'goal'    && goal)      goal.set(d.percent);
      if (d.kp === 'chat'    && chat)      chat.add({ u: d.u, c: d.c || '#f0a830', m: d.m });
      if (d.kp === 'palette' && d.name)    setPalette(d.name);
    });
  }

  global.LedgeWatch = {
    rooftop, topStrip, goal, alertHost, timer, countdown, chat, cam, ticker, typo, bind,
    setPalette, applyAutoPalette,
    twitchChat, viewerPoll, streamInfoPoll, parseUptime, resetTimer,
    CHAT_POOL, THOUGHTS,
  };
})(window);
