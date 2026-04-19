// Tweaks panel — floating bottom-right. Toggle visibility with `T` key.

const TweaksPanel = ({ visible, state, setState, onFireAlert }) => {
  if (!visible) return null;
  const palettes = ['dusk', 'midnight', 'dawn'];
  const pill = (active) => ({
    padding: '6px 10px',
    fontSize: 11, letterSpacing: 2, fontWeight: 700,
    fontFamily: 'JetBrains Mono',
    background: active ? '#f0a830' : 'rgba(255,255,255,0.08)',
    color: active ? '#0a0812' : '#c8c0e0',
    border: '1px solid rgba(255,255,255,0.1)',
    cursor: 'pointer', textTransform: 'uppercase', borderRadius: 4,
  });
  const row = { display: 'flex', gap: 6, flexWrap: 'wrap' };
  const label = { fontSize: 10, letterSpacing: 3, color: '#8870c0', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6, fontFamily: 'JetBrains Mono' };
  return (
    <div style={{
      position: 'fixed', right: 16, bottom: 16, zIndex: 9999,
      width: 300, padding: 16,
      background: 'rgba(14,10,28,0.96)', backdropFilter: 'blur(12px)',
      border: '1px solid rgba(240,168,48,0.35)',
      boxShadow: '0 12px 40px rgba(0,0,0,0.6), 0 0 30px rgba(240,168,48,0.15)',
      color: '#e8e4f0',
      fontFamily: 'JetBrains Mono',
      borderRadius: 6,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, paddingBottom: 10, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ fontFamily: 'Rubik Mono One', fontSize: 14, letterSpacing: 3, color: '#f0a830' }}>TWEAKS</div>
        <div style={{ fontSize: 10, letterSpacing: 2, color: '#8870c0' }}>LEDGE WATCH</div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={label}>Scene</div>
        <div style={row}>
          {[
            ['starting','Starting'],
            ['in-game','In-game'],
            ['just-chatting','Just Chatting'],
            ['brb','BRB'],
            ['ending','Ending'],
          ].map(([k, lab]) => (
            <button key={k} style={pill(state.scene === k)} onClick={() => setState({ ...state, scene: k })}>{lab}</button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={label}>Palette</div>
        <div style={row}>
          {palettes.map((p) => (
            <button key={p} style={pill(state.palette === p)} onClick={() => setState({ ...state, palette: p })}>{p}</button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={label}>Theme</div>
        <div style={row}>
          {['dark','light'].map((t) => (
            <button key={t} style={pill(state.theme === t)} onClick={() => setState({ ...state, theme: t })}>{t}</button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={label}>Goal Progress · {state.goalPercent}%</div>
        <input type="range" min={0} max={100} step={1} value={state.goalPercent}
          onChange={(e) => setState({ ...state, goalPercent: Number(e.target.value) })}
          style={{ width: '100%', accentColor: '#f0a830' }}
        />
      </div>

      <div style={{ marginBottom: 4 }}>
        <div style={label}>Fire a fake alert</div>
        <div style={row}>
          {['follow','sub','bits','donate','raid'].map((t) => (
            <button key={t} style={pill(false)} onClick={() => onFireAlert(t)}>{t}</button>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 14, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: 9, letterSpacing: 2, color: '#6850a0' }}>
        PRESS T TO HIDE PANEL · OBS: ADD AS BROWSER SOURCE 1920×1080
      </div>
    </div>
  );
};

Object.assign(window, { TweaksPanel });
