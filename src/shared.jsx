// Shared hooks, state, scaling, and tiny utilities.

const { useState, useEffect, useRef, useLayoutEffect } = React;

// 1920x1080 scaled to viewport, letterboxed on black.
function StreamStage({ children }) {
  const outerRef = useRef(null);
  const [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    const update = () => {
      if (!outerRef.current) return;
      const { width, height } = outerRef.current.getBoundingClientRect();
      setScale(Math.min(width / 1920, height / 1080));
    };
    update();
    const ro = new ResizeObserver(update);
    if (outerRef.current) ro.observe(outerRef.current);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={outerRef} style={{
      position: 'absolute', inset: 0, background: '#000',
      display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
    }}>
      <div style={{
        width: 1920, height: 1080,
        transform: `scale(${scale})`, transformOrigin: 'center center',
        position: 'relative', flexShrink: 0,
      }}>
        {children}
      </div>
    </div>
  );
}

// Live-ish clock that ticks each second. Starts at 2:14:37 and goes up.
function useStreamTimer(startSeconds = 2 * 3600 + 14 * 60 + 37) {
  const [t, setT] = useState(startSeconds);
  useEffect(() => {
    const id = setInterval(() => setT((x) => x + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const s = t % 60;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

// Countdown used on Starting Soon scenes.
function useCountdown(startSeconds = 5 * 60 + 12) {
  const [t, setT] = useState(startSeconds);
  useEffect(() => {
    const id = setInterval(() => setT((x) => (x > 0 ? x - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);
  const m = Math.floor(t / 60);
  const s = t % 60;
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

// Shared fake chat feed.
const CHAT_POOL = [
  { u: 'breadwhisperer',  c: '#f0a830', m: 'COO COO' },
  { u: 'TacticalRalph',   c: '#7ecfff', m: 'that shot was filthy' },
  { u: 'pigeon_prime',    c: '#c890ff', m: 'this overlay is different' },
  { u: 'Vost0k_enjoyer',  c: '#9ad48c', m: 'did we just hear a footstep' },
  { u: 'NotARat',         c: '#ff8b7a', m: 'feed me KP' },
  { u: 'concrete_jungle', c: '#e8c47a', m: 'rooftop hits different at dusk' },
  { u: 'LootGoblin42',    c: '#b0a8d0', m: 'pop the red' },
  { u: 'crumbhunter',     c: '#f0a830', m: 'left 6 crumbs on the ledge for you king' },
  { u: 'raid_leader',     c: '#7ecfff', m: 'full wipe lets get another' },
  { u: 'pidgeonmother',   c: '#ffa8c8', m: 'he\u2019s locked in' },
  { u: 'Marathon_heat',   c: '#ff6b6b', m: 'GG WP' },
  { u: 'WindroseMain',    c: '#9ad48c', m: 'when we farming again' },
  { u: 'clutch_or_kick',  c: '#c890ff', m: '1v3 coming up' },
  { u: 'SubLurker',       c: '#b0a8d0', m: 'just lurking hi' },
];

function useFakeChat(intervalMs = 2200) {
  const [msgs, setMsgs] = useState(() =>
    [...Array(6)].map((_, i) => ({ ...CHAT_POOL[i % CHAT_POOL.length], id: i }))
  );
  const nextId = useRef(6);
  useEffect(() => {
    const id = setInterval(() => {
      const pick = CHAT_POOL[Math.floor(Math.random() * CHAT_POOL.length)];
      setMsgs((prev) => [...prev.slice(-9), { ...pick, id: nextId.current++ }]);
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return msgs;
}

// Fake alert queue — pushed externally; pops after duration.
function useAlertQueue() {
  const [alert, setAlert] = useState(null);
  const trigger = (a) => {
    setAlert({ ...a, id: Date.now() });
    setTimeout(() => setAlert(null), 6500);
  };
  return [alert, trigger];
}

const ALERT_PRESETS = [
  { type: 'follow',  name: 'flock_boss',      amount: null,           msg: 'followed the flock' },
  { type: 'sub',     name: 'StreetFighter_X', amount: 'Tier 1',       msg: 'just subbed!' },
  { type: 'sub',     name: 'breadwhisperer',  amount: 'Tier 3 \u00d7 6mo', msg: 'resubbed \u2014 6 months deep' },
  { type: 'bits',    name: 'TacticalRalph',   amount: '500 bits',     msg: 'tossed 500 bits' },
  { type: 'donate',  name: 'anonymous',       amount: '$25.00',       msg: 'buy yourself a sandwich' },
  { type: 'raid',    name: 'Vost0k_stream',   amount: '42 raiders',   msg: 'raiding with 42' },
];

Object.assign(window, {
  StreamStage, useStreamTimer, useCountdown, useFakeChat, useAlertQueue,
  ALERT_PRESETS, CHAT_POOL,
});
