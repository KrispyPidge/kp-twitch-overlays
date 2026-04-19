// App root. Hosts stage scaling, scene tabs, tweaks panel, and fake alert trigger.
// Press `T` to toggle the Tweaks panel. Press `H` to hide all chrome (clean OBS view).

const { useState: useStateA, useEffect: useEffectA } = React;

function App() {
  const defaults = window.__TWEAK_DEFAULTS || {};
  const [state, setState] = useStateA({
    scene: defaults.scene || 'just-chatting',
    goalPercent: defaults.goalPercent ?? 65,
    theme: defaults.theme || 'dark',
    palette: defaults.palette || 'dusk',
  });
  const [showTweaks, setShowTweaks] = useStateA(false);
  const [showChrome, setShowChrome] = useStateA(true);
  const [alert, setAlert] = useAlertQueue();

  // Hotkeys: T = tweaks panel, H = scene tabs.
  useEffectA(() => {
    const onKey = (e) => {
      if (e.key === 't' || e.key === 'T') setShowTweaks((v) => !v);
      if (e.key === 'h' || e.key === 'H') setShowChrome((v) => !v);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Random ambient alerts ~every 18s so the preview always feels alive.
  useEffectA(() => {
    const id = setInterval(() => {
      if (Math.random() < 0.5) {
        const preset = ALERT_PRESETS[Math.floor(Math.random() * ALERT_PRESETS.length)];
        setAlert(preset);
      }
    }, 18000);
    return () => clearInterval(id);
  }, []);

  const fireAlert = (type) => {
    const preset = ALERT_PRESETS.find((a) => a.type === type) || ALERT_PRESETS[0];
    setAlert(preset);
  };

  const sceneTab = (k) => ({
    padding: '8px 14px',
    fontFamily: 'JetBrains Mono', fontSize: 12, letterSpacing: 3, fontWeight: 700,
    background: state.scene === k ? '#f0a830' : 'rgba(20,14,36,0.8)',
    color: state.scene === k ? '#0a0812' : '#e8e4f0',
    border: '1px solid rgba(240,168,48,0.35)',
    borderRadius: 4, cursor: 'pointer', textTransform: 'uppercase',
    backdropFilter: 'blur(6px)',
  });

  // Light theme overlay (simple wash for legibility).
  const themeWash = state.theme === 'light' ? (
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 9000,
      background: 'rgba(248,240,220,0.18)', mixBlendMode: 'screen',
    }} />
  ) : null;

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#000' }}>
      <PigeonKeyframes />
      <StreamStage>
        <div style={{ position: 'absolute', inset: 0 }}>
          <DirectionD scene={state.scene} palette={state.palette} percent={state.goalPercent} alert={alert} />
          {themeWash}
        </div>
      </StreamStage>

      {showChrome && (
        <>
          <div style={{
            position: 'fixed', top: 12, left: '50%', transform: 'translateX(-50%)',
            display: 'flex', gap: 6, zIndex: 9500,
          }}>
            {[
              ['starting','Starting Soon'],
              ['in-game','In-Game'],
              ['just-chatting','Just Chatting'],
              ['brb','BRB'],
              ['ending','Ending'],
            ].map(([k, lab]) => (
              <button key={k} style={sceneTab(k)} onClick={() => setState({ ...state, scene: k })}>{lab}</button>
            ))}
          </div>
          <div style={{
            position: 'fixed', top: 16, right: 16, zIndex: 9500,
            fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: 3, color: '#8870c0',
            background: 'rgba(20,14,36,0.75)', padding: '6px 10px', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 4,
          }}>
            1920 × 1080 · OBS BROWSER SOURCE · T = TWEAKS · H = HIDE
          </div>
        </>
      )}

      <TweaksPanel visible={showTweaks} state={state} setState={setState} onFireAlert={fireAlert} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
