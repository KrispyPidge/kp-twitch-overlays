/*
  Ledge Watch · StreamElements bridge
  Runs inside an SE Custom Widget. Loads a Ledge Watch scene in an iframe
  and forwards StreamElements events to it as postMessage({kp:'alert',...}).

  Fields expected (set these as Custom Fields on the widget):
    scene        — scene slug, e.g. "04-in-game"    (required)
    extraParams  — extra URL params, e.g. "hidecam=1&palette=midnight"

  Scenes live at:  https://krispypidge.github.io/kp-twitch-overlays/obs/<scene>.html
*/

const BASE = 'https://krispypidge.github.io/kp-twitch-overlays/obs/';

// --- Boot: load the scene into the iframe -----------------------------------
let frame = null;

window.addEventListener('onWidgetLoad', (obj) => {
  const fields = obj.detail && obj.detail.fieldData || {};
  const scene = (fields.scene || '04-in-game').trim();
  const extra = (fields.extraParams || '').trim().replace(/^\?+/, '');
  const url = BASE + scene + '.html' + (extra ? '?' + extra : '');

  frame = document.getElementById('ledge-frame');
  frame.src = url;
  console.log('[Ledge Watch] scene loaded:', url);
});

// --- Helper: post to the Ledge Watch iframe --------------------------------
function toLedge(msg) {
  if (!frame || !frame.contentWindow) return;
  frame.contentWindow.postMessage(msg, '*');
}

// --- Prime-safe tier resolution --------------------------------------------
const TIER_MAP = { '1000': '1', '2000': '2', '3000': '3' };
function resolveTier(d) {
  if (!d) return { isPrime: false, label: 'Tier 1' };
  const tierRaw = (d.tier || d.subPlan || '').toString().toLowerCase();
  const isPrime =
    tierRaw === 'prime' || d.isPrime === true || d.subPlan === 'Prime' ||
    (tierRaw === '' && (d.type === 'subscriber' || d.type === 'resub'));
  if (isPrime) return { isPrime: true, label: 'Prime' };
  const lvl = TIER_MAP[tierRaw] || TIER_MAP[d.tier] || '1';
  return { isPrime: false, label: `Tier ${lvl}` };
}

// --- SE event stream -------------------------------------------------------
window.addEventListener('onEventReceived', (ev) => {
  const listener = ev.detail && ev.detail.listener;
  const d = (ev.detail && ev.detail.event) || {};

  switch (listener) {
    case 'follower-latest':
      toLedge({
        kp: 'alert', type: 'follow',
        name: d.name || 'anonymous',
        msg: 'followed the flock',
      });
      break;

    case 'subscriber-latest': {
      const { label } = resolveTier(d);
      const months = d.amount || d.months || 1;
      const gifted = d.gifted === true;
      const bulkGift = d.bulkGifted === true || d.sender;
      toLedge({
        kp: 'alert', type: 'sub',
        name: gifted && d.sender ? d.sender : (d.name || 'anonymous'),
        amount: bulkGift
          ? `${label} gift × ${d.amount || 1}`
          : gifted
            ? `${label} · gifted to ${d.name}`
            : `${label} · ${months}mo`,
        msg: d.message || (gifted ? 'gifted a sub' : (months > 1 ? 'resubbed · loyalty logged' : 'joined the flock')),
      });
      break;
    }

    case 'cheer-latest':
      toLedge({
        kp: 'alert', type: 'bits',
        name: d.name || 'anonymous',
        amount: `${d.amount || 0} bits`,
        msg: d.message || 'tossed crumbs',
      });
      break;

    case 'tip-latest':
      toLedge({
        kp: 'alert', type: 'donate',
        name: d.name || 'anonymous',
        amount: `£${Number(d.amount || 0).toFixed(2)}`,
        msg: d.message || 'paid tribute in bread',
      });
      break;

    case 'raid-latest':
    case 'host-latest':
      toLedge({
        kp: 'alert', type: 'raid',
        name: d.name || 'anonymous',
        amount: `${d.amount || 0} raiders`,
        msg: 'raiding with the flock',
      });
      break;

    case 'message': {
      // SE chat event: forward as {kp:'chat',...} so chat boxes on scenes can show real msgs
      const msg = d.data || {};
      toLedge({
        kp: 'chat',
        u: msg.nick || msg.displayName || 'unknown',
        c: (msg.tags && msg.tags.color) || '#f0a830',
        m: msg.text || '',
      });
      break;
    }

    default:
      // uncomment while debugging:
      // console.debug('[Ledge Watch] unhandled SE event', listener, d);
      break;
  }
});

// --- Optional: manual test from the SE editor console ---------------------
window.LedgeBridge_test = {
  sub:   () => toLedge({ kp:'alert', type:'sub',    name:'breadwhisperer', amount:'Tier 3 · 6mo', msg:'6 months deep' }),
  prime: () => toLedge({ kp:'alert', type:'sub',    name:'pigeon_prime',   amount:'Prime · 1mo', msg:'prime subbed' }),
  bits:  () => toLedge({ kp:'alert', type:'bits',   name:'TacticalRalph',  amount:'500 bits',    msg:'tossed crumbs' }),
  tip:   () => toLedge({ kp:'alert', type:'donate', name:'anonymous',      amount:'£25.00',      msg:'for the cause' }),
  raid:  () => toLedge({ kp:'alert', type:'raid',   name:'Vost0k_stream',  amount:'42 raiders',  msg:'incoming' }),
  goal:  (p) => toLedge({ kp:'goal', percent: p }),
};
