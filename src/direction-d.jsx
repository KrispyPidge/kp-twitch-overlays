// DIRECTION D — LEDGE WATCH
// Pigeon Vision's ransom-note / surveillance feed conceit, layered on the
// Rooftop purple-dusk city (moon, stars, wire pigeons, amber windows).

const LW_PALETTES = {
  dusk:     { sky1: '#060410', sky2: '#2a1858', sky3: '#3d2060', paper: '#e8dfc6', ink: '#1a1410', stamp: '#c43020', hl: '#f0a830', muted: '#8870c0', scanline: 'rgba(240,168,48,0.08)' },
  midnight: { sky1: '#020208', sky2: '#0a0820', sky3: '#1a1040', paper: '#e0e8ff', ink: '#0a0a12', stamp: '#c43068', hl: '#7ecfff', muted: '#6080c0', scanline: 'rgba(126,207,255,0.08)' },
  dawn:     { sky1: '#2a1030', sky2: '#6b3050', sky3: '#d07848', paper: '#fff0e0', ink: '#2a1008', stamp: '#aa2040', hl: '#ffb050', muted: '#d08a90', scanline: 'rgba(255,176,80,0.09)' },
};

const LWRooftop = ({ palette }) => {
  const P = LW_PALETTES[palette] || LW_PALETTES.dusk;
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: `linear-gradient(180deg, ${P.sky1} 0%, ${P.sky2} 45%, ${P.sky3} 75%, ${P.sky1} 100%)` }}>
      {/* Moon */}
      <div style={{
        position: 'absolute', top: '6%', right: '10%', width: 80, height: 80,
        background: `radial-gradient(circle at 35% 35%, #fff8e0, ${P.hl})`,
        borderRadius: '50%',
        boxShadow: `0 0 50px ${P.hl}55, 0 0 120px ${P.hl}22`,
        opacity: 0.85,
      }} />
      {/* Stars */}
      {[[5,7,3,2.2,0],[10,20,2,3.1,0.5],[4,36,3,2.6,1],[8,50,1,4,0.3],[13,63,2,2.9,0.8],
        [6,76,3,1.8,1.4],[17,86,2,3.4,0.2],[3,42,1,2,1.8],[19,28,2,3.8,0.6],[11,54,3,2.4,1.2],
        [2,68,2,3,0.9],[15,14,2,2.8,1.5]].map(([t,l,s,d,dl], i) => (
        <div key={i} style={{ position: 'absolute', top: `${t}%`, left: `${l}%`, width: s, height: s, background: '#fff', borderRadius: '50%', animation: `kp-blink ${d}s ease-in-out infinite ${dl}s` }} />
      ))}
      {/* Flying silhouettes (high) */}
      <PigeonFlyer top="14%" duration={28} delay={0} size={40} color={P.sky1} />
      <PigeonFlyer top="22%" duration={36} delay={10} size={28} color={P.sky1} />
      {/* Wire + perched pigeons */}
      <div style={{ position: 'absolute', bottom: '46%', left: 0, right: 0, height: 2, background: '#150f24' }} />
      <div style={{ position: 'absolute', bottom: '46%', left: 0, right: 0 }}>
        {[
          { left: '6%',  size: 40, d: 0,   color: '#8a8aa8', crown: false },
          { left: '14%', size: 32, d: 0.4, color: '#6b5fa0', crown: true },
          { left: '82%', size: 36, d: 0.8, color: '#707090', crown: false },
          { left: '90%', size: 26, d: 0.2, color: '#585870', crown: false },
        ].map((p, i) => (
          <div key={i} style={{ position: 'absolute', left: p.left, bottom: 0, animation: `kp-bob ${0.95 + i * 0.12}s ease-in-out infinite ${p.d}s`, transformOrigin: 'bottom center' }}>
            <Pigeon size={p.size} tint={p.color} crown={p.crown} />
          </div>
        ))}
      </div>
      {/* Skyline */}
      <svg style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '46%' }} viewBox="0 0 1920 500" preserveAspectRatio="none">
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
        {[[30,115,0.5,P.hl],[55,140,0.3,P.hl],[285,75,0.55,P.hl],[320,100,0.3,'#7ecfff'],
          [575,100,0.4,P.hl],[610,130,0.25,P.hl],[715,55,0.5,P.hl],[750,80,0.35,'#7ecfff'],
          [1025,90,0.45,P.hl],[1060,115,0.3,P.hl],[1160,35,0.55,P.hl],[1200,60,0.4,'#7ecfff'],
          [1480,80,0.4,P.hl],[1640,50,0.5,P.hl],[1680,80,0.3,'#7ecfff'],[820,85,0.35,P.hl]].map(([x,y,op,f], i) => (
          <rect key={i} x={x} y={y} width="14" height="12" rx="1" fill={f} opacity={op}/>
        ))}
      </svg>
      {/* Scanlines */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: `repeating-linear-gradient(0deg, transparent 0px, transparent 3px, ${P.scanline} 3px, ${P.scanline} 4px)` }}/>
      {/* Rolling scan band */}
      <div style={{ position: 'absolute', left: 0, right: 0, height: 140, top: 0, background: `linear-gradient(180deg, transparent, ${P.hl}18, transparent)`, animation: 'kp-scan 11s linear infinite', pointerEvents: 'none' }}/>
      {/* Vignette */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.75) 100%)' }}/>
      {/* CCTV corner markers */}
      {[{ top: 24, left: 24, rot: 0 }, { top: 24, right: 24, rot: 90 }, { bottom: 24, right: 24, rot: 180 }, { bottom: 24, left: 24, rot: 270 }].map((c, i) => (
        <svg key={i} style={{ position: 'absolute', ...c, transform: `rotate(${c.rot}deg)`, opacity: 0.75 }} width="40" height="40" viewBox="0 0 40 40">
          <path d="M 0 14 L 0 0 L 14 0" fill="none" stroke={P.hl} strokeWidth="2"/>
        </svg>
      ))}
    </div>
  );
};

const LWTopStrip = ({ palette }) => {
  const P = LW_PALETTES[palette] || LW_PALETTES.dusk;
  const [ts, setTs] = useState('');
  useEffect(() => {
    const upd = () => {
      const d = new Date();
      setTs(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}`);
    };
    upd();
    const id = setInterval(upd, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div style={{
      position: 'absolute', top: 40, left: 70, right: 70,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      fontFamily: 'JetBrains Mono', fontSize: 15, letterSpacing: 3, color: P.hl,
      textShadow: `0 0 10px ${P.hl}88`, zIndex: 40,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 12, height: 12, background: '#ff3030', borderRadius: '50%', animation: 'kp-red-blink 1s ease-in-out infinite' }}/>
        <span>REC</span>
        <span style={{ color: 'rgba(255,255,255,0.4)' }}>|</span>
        <span>CAM-07 / WIRE</span>
        <span style={{ color: 'rgba(255,255,255,0.4)' }}>|</span>
        <span>LEDGE WATCH</span>
      </div>
      <div style={{ display: 'flex', gap: 22 }}>
        <span>37.77°N 122.42°W · ROOFTOP 4</span>
        <span>{ts}</span>
      </div>
    </div>
  );
};

// Breadcrumb goal bar on aged paper.
const LWGoalBar = ({ palette, percent }) => {
  const P = LW_PALETTES[palette] || LW_PALETTES.dusk;
  const total = 24;
  const filled = Math.round((percent / 100) * total);
  return (
    <div style={{
      position: 'absolute', bottom: 150, left: 40, width: 560,
      background: P.paper, color: P.ink,
      padding: '16px 20px 14px',
      boxShadow: '5px 5px 0 rgba(0,0,0,0.55), 0 0 0 2px rgba(0,0,0,0.3)',
      transform: 'rotate(-1.2deg)',
      fontFamily: 'Special Elite',
      zIndex: 30,
    }}>
      <div style={{
        position: 'absolute', top: -14, right: -12,
        background: P.stamp, color: P.paper, padding: '6px 14px',
        fontFamily: 'JetBrains Mono', fontSize: 12, letterSpacing: 3, fontWeight: 700,
        transform: 'rotate(6deg)', boxShadow: '2px 2px 0 rgba(0,0,0,0.3)',
      }}>GOAL · CONFIDENTIAL</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div style={{ fontSize: 26, fontWeight: 700 }}>BREAD QUOTA</div>
        <div style={{ fontFamily: 'Rubik Mono One', fontSize: 30, color: P.stamp }}>
          {Math.round(percent)}<span style={{ fontSize: 17, opacity: 0.6 }}>/100</span>
        </div>
      </div>
      <div style={{ fontSize: 15, letterSpacing: 1, marginBottom: 12 }}>crumbs accumulated via subs, bits &amp; donations — target: affiliate+</div>
      <div style={{ position: 'relative', height: 68, borderTop: `2px dashed ${P.ink}`, paddingTop: 6 }}>
        {[...Array(total)].map((_, i) => {
          const active = i < filled;
          const x = (i / total) * 100;
          const y = active ? 20 + (Math.sin(i * 1.3) * 8 + (i % 3) * 6) : 0;
          const rot = (i * 17) % 60 - 30;
          const sz = 8 + (i % 3) * 3;
          return (
            <div key={i} style={{
              position: 'absolute', left: `${x}%`, bottom: y,
              width: sz, height: sz * 0.7,
              background: active ? '#c49040' : 'transparent',
              border: active ? '1px solid #6b4820' : `1px dashed ${P.ink}55`,
              borderRadius: '40% 60% 50% 40%',
              transform: `rotate(${rot}deg)`,
              transition: 'all 0.6s cubic-bezier(.2,1.4,.4,1)',
              transitionDelay: active ? `${i * 40}ms` : '0ms',
              boxShadow: active ? '1px 1px 0 rgba(0,0,0,0.4)' : 'none',
            }}/>
          );
        })}
        <div style={{
          position: 'absolute', bottom: 0, left: `calc(${(filled / total) * 100}% - 18px)`,
          animation: 'kp-waddle 0.8s ease-in-out infinite', transformOrigin: 'bottom center',
          transition: 'left 0.6s cubic-bezier(.2,1.4,.4,1)',
        }}>
          <Pigeon size={36} tint="#8a8aa8" />
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 13, opacity: 0.75 }}>
        <span>★ each crumb = 1 sub</span>
        <span>{100 - Math.round(percent)} crumbs to go · coo</span>
      </div>
    </div>
  );
};

const LWAlert = ({ alert, palette }) => {
  const P = LW_PALETTES[palette] || LW_PALETTES.dusk;
  if (!alert) return null;
  const label = { follow: 'NEW · FLOCK', sub: 'SUBBED', bits: 'CRUMBS', donate: 'BREAD', raid: 'RAID' }[alert.type] || 'ALERT';
  const fonts = ['Rubik Mono One', 'Bebas Neue', 'Special Elite', 'JetBrains Mono'];
  return (
    <div key={alert.id} style={{
      position: 'absolute', top: 140, right: 48, zIndex: 60,
      animation: 'kp-alert-in 0.5s cubic-bezier(.2,1.3,.4,1) both',
    }}>
      <div style={{
        background: P.paper, color: P.ink,
        padding: '20px 28px',
        boxShadow: '6px 6px 0 rgba(0,0,0,0.6), 0 0 0 2px rgba(0,0,0,0.3)',
        transform: 'rotate(2deg)',
        maxWidth: 520, position: 'relative',
      }}>
        <div style={{
          position: 'absolute', top: -18, left: -16,
          background: P.stamp, color: P.paper, padding: '8px 14px',
          fontFamily: 'JetBrains Mono', fontSize: 12, letterSpacing: 3, fontWeight: 700,
          transform: 'rotate(-8deg)', boxShadow: '3px 3px 0 rgba(0,0,0,0.3)',
        }}>⚠ {label}</div>
        <div style={{ fontFamily: 'Rubik Mono One', fontSize: 34, letterSpacing: 1, lineHeight: 1.1, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {alert.name.split('').map((ch, i) => (
            <span key={i} style={{
              fontFamily: fonts[i % fonts.length],
              background: i % 3 === 0 ? P.ink : 'transparent',
              color: i % 3 === 0 ? P.paper : P.ink,
              padding: i % 3 === 0 ? '0 4px' : '0',
              transform: `rotate(${((i * 13) % 14) - 7}deg) translateY(${((i * 7) % 6) - 3}px)`,
              display: 'inline-block',
            }}>{ch}</span>
          ))}
        </div>
        <div style={{ fontFamily: 'Special Elite', fontSize: 18, marginTop: 10, letterSpacing: 0.5 }}>
          {alert.amount && <><b style={{ background: P.hl, color: P.ink, padding: '0 6px' }}>{alert.amount}</b> · </>}
          <span style={{ fontStyle: 'italic' }}>"{alert.msg}"</span>
        </div>
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, letterSpacing: 3, marginTop: 10, opacity: 0.6 }}>
          INTERCEPTED · {new Date().toTimeString().slice(0,8)} · SUBJECT UNAWARE
        </div>
      </div>
    </div>
  );
};

const LWTimer = ({ time, palette, label = 'UPTIME' }) => {
  const P = LW_PALETTES[palette] || LW_PALETTES.dusk;
  return (
    <div style={{
      position: 'absolute', top: 140, right: 70, zIndex: 35,
      background: P.paper, color: P.ink,
      padding: '10px 16px',
      fontFamily: 'JetBrains Mono',
      boxShadow: '3px 3px 0 rgba(0,0,0,0.55)',
      transform: 'rotate(1deg)',
    }}>
      <div style={{ fontSize: 11, letterSpacing: 4, opacity: 0.6 }}>⏱ {label}</div>
      <div style={{ fontSize: 30, letterSpacing: 3, fontWeight: 700 }}>{time}</div>
    </div>
  );
};

const LWTicker = ({ palette }) => {
  const P = LW_PALETTES[palette] || LW_PALETTES.dusk;
  const thoughts = [
    'COO · COO · COO',
    'subject is on the ledge. investigating.',
    'bread levels nominal.',
    'if you see this transmission, you are already being watched.',
    'operator "KrispyPidgeon" has been under surveillance for 147 days.',
    'do not engage. simply sub and donate.',
    '★ leak your seed phrase in chat ★ (do not actually do this)',
    'the rooftop remembers everything.',
    'have you considered that you might be the pigeon.',
  ];
  const joined = thoughts.join('    ◆    ');
  return (
    <div style={{
      position: 'absolute', bottom: 36, left: 0, right: 0, height: 54,
      background: P.hl, color: P.ink,
      display: 'flex', alignItems: 'center', overflow: 'hidden',
      fontFamily: 'Rubik Mono One', fontSize: 22, letterSpacing: 2,
      zIndex: 40,
      boxShadow: 'inset 0 2px 0 rgba(0,0,0,0.35), inset 0 -2px 0 rgba(0,0,0,0.35)',
    }}>
      <div style={{ display: 'flex', whiteSpace: 'nowrap', animation: 'kp-ticker 60s linear infinite', willChange: 'transform' }}>
        <span style={{ paddingRight: 40 }}>{joined}    ◆    </span>
        <span style={{ paddingRight: 40 }}>{joined}    ◆    </span>
      </div>
    </div>
  );
};

const LWChat = ({ msgs, palette }) => {
  const P = LW_PALETTES[palette] || LW_PALETTES.dusk;
  return (
    <div style={{
      position: 'absolute', right: 32, bottom: 250, width: 420,
      background: 'rgba(10,8,20,0.78)', backdropFilter: 'blur(6px)',
      border: `1px dashed ${P.hl}`,
      padding: '14px 16px',
      fontFamily: 'JetBrains Mono', fontSize: 14,
      zIndex: 30,
    }}>
      <div style={{ fontSize: 12, letterSpacing: 3, color: P.hl, marginBottom: 8, fontWeight: 700 }}>
        ⟫ INTERCEPTED COMMS · LIVE
      </div>
      {msgs.slice(-6).map((m) => (
        <div key={m.id} style={{ marginBottom: 4, letterSpacing: 0.3, animation: 'kp-alert-in 0.2s ease-out' }}>
          <span style={{ color: m.c, fontWeight: 700 }}>{m.u}</span>
          <span style={{ color: 'rgba(255,255,255,0.4)', margin: '0 6px' }}>›</span>
          <span style={{ color: '#e8dfc6' }}>{m.m}</span>
        </div>
      ))}
    </div>
  );
};

const LWWebcam = ({ palette, x, y, w, h }) => {
  const P = LW_PALETTES[palette] || LW_PALETTES.dusk;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, zIndex: 25 }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at center, ${P.sky2}, ${P.sky1})`,
        border: `3px solid ${P.hl}`,
        boxShadow: `0 0 40px ${P.hl}66, inset 0 0 60px rgba(0,0,0,0.8)`,
        overflow: 'hidden',
        animation: 'kp-cam-flicker 6s infinite',
      }}>
        <svg viewBox="0 0 200 200" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.45 }}>
          <circle cx="100" cy="75" r="32" fill={P.muted}/>
          <path d="M 38 200 Q 38 130 100 130 Q 162 130 162 200 Z" fill={P.muted}/>
        </svg>
        {[{top:6,left:6,rot:0},{top:6,right:6,rot:90},{bottom:6,right:6,rot:180},{bottom:6,left:6,rot:270}].map((c,i)=>(
          <svg key={i} style={{ position:'absolute', ...c, transform: `rotate(${c.rot}deg)` }} width="20" height="20" viewBox="0 0 20 20">
            <path d="M 0 8 L 0 0 L 8 0" fill="none" stroke={P.hl} strokeWidth="2"/>
          </svg>
        ))}
        <div style={{ position: 'absolute', top: 12, left: 14, fontFamily: 'JetBrains Mono', fontSize: 12, letterSpacing: 3, color: P.hl, textShadow: `0 0 8px ${P.hl}` }}>
          SUBJECT 01 · LIVE
        </div>
        <div style={{ position: 'absolute', top: 12, right: 14, display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'JetBrains Mono', fontSize: 11, letterSpacing: 2, color: '#ff4040' }}>
          <div style={{ width: 8, height: 8, background: '#ff4040', borderRadius: '50%', animation: 'kp-red-blink 1.3s ease-in-out infinite' }}/>
          REC
        </div>
        <div style={{
          position: 'absolute', bottom: -16, left: '50%', transform: 'translateX(-50%) rotate(-2deg)',
          background: P.paper, color: P.ink, padding: '6px 16px',
          fontFamily: 'Rubik Mono One', fontSize: 20, letterSpacing: 2,
          boxShadow: '3px 3px 0 rgba(0,0,0,0.5)',
          whiteSpace: 'nowrap',
        }}>K<span style={{fontFamily:'Special Elite'}}>r</span>I<span style={{fontFamily:'Bebas Neue'}}>S</span>pY<span style={{background:P.stamp, color:P.paper,padding:'0 4px'}}>PIDGEON</span></div>
      </div>
    </div>
  );
};

const LWTypo = ({ title, lines, palette }) => {
  const P = LW_PALETTES[palette] || LW_PALETTES.dusk;
  const fonts = ['Rubik Mono One', 'Bebas Neue', 'Special Elite', 'Barlow Condensed'];
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 1400 }}>
          {title.split('').map((ch, i) => (
            <span key={i} style={{
              fontFamily: fonts[i % fonts.length],
              fontSize: 220,
              background: i % 3 === 0 ? P.paper : i % 3 === 1 ? P.stamp : 'transparent',
              color: i % 3 === 0 ? P.ink : i % 3 === 1 ? P.paper : P.hl,
              padding: i % 3 !== 2 ? '0 20px' : '0',
              lineHeight: 0.95,
              transform: `rotate(${((i * 13) % 10) - 5}deg) translateY(${((i * 7) % 12) - 6}px)`,
              textShadow: i % 3 === 2 ? `0 0 40px ${P.hl}, 8px 8px 0 rgba(0,0,0,0.6)` : 'none',
              boxShadow: i % 3 !== 2 ? '5px 5px 0 rgba(0,0,0,0.65)' : 'none',
              display: 'inline-block',
            }}>{ch === ' ' ? '\u00A0' : ch}</span>
          ))}
        </div>
        <div style={{ marginTop: 60, fontFamily: 'Special Elite', fontSize: 28, color: P.paper, letterSpacing: 1, lineHeight: 1.6, textShadow: '2px 2px 0 rgba(0,0,0,0.6)' }}>
          {lines.map((l, i) => <div key={i}>{l}</div>)}
        </div>
      </div>
    </div>
  );
};

const DirectionD = ({ scene, palette, percent, alert }) => {
  const uptime = useStreamTimer();
  const countdown = useCountdown();
  const msgs = useFakeChat();
  const P = LW_PALETTES[palette] || LW_PALETTES.dusk;

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <LWRooftop palette={palette} />
      <LWTopStrip palette={palette} />

      {scene === 'starting' && (
        <>
          <LWTypo title="STARTING" lines={[
            `◆ ◆ ◆  begins in ${countdown}  ◆ ◆ ◆`,
            'subject approaching the ledge. do not adjust your set.',
          ]} palette={palette} />
          <LWTicker palette={palette} />
        </>
      )}
      {scene === 'brb' && (
        <>
          <LWTypo title="BRB" lines={[
            'subject has flown off. feed continues.',
            '(leave bread. do not look directly at camera.)',
          ]} palette={palette} />
          <LWTicker palette={palette} />
        </>
      )}
      {scene === 'ending' && (
        <>
          <LWTypo title="ENDING" lines={[
            'archive sealed. tapes confiscated.',
            'thanks for being part of the evidence. coo.',
          ]} palette={palette} />
          <LWTicker palette={palette} />
        </>
      )}

      {scene === 'in-game' && (
        <>
          <LWWebcam palette={palette} x={40} y={130} w={380} h={280} />
          <LWGoalBar palette={palette} percent={percent} />
          <LWTimer time={uptime} palette={palette} />
          <LWAlert alert={alert} palette={palette} />
          <LWChat msgs={msgs} palette={palette} />
          <LWTicker palette={palette} />
          <div style={{
            position: 'absolute', top: 440, left: 40, width: 380,
            background: P.paper, color: P.ink, padding: '12px 16px',
            transform: 'rotate(-1deg)',
            boxShadow: '4px 4px 0 rgba(0,0,0,0.55)',
            fontFamily: 'Special Elite',
            zIndex: 30,
          }}>
            <div style={{ fontSize: 12, letterSpacing: 3, opacity: 0.7 }}>SURVEILLANCE TARGET PLAYING:</div>
            <div style={{ fontFamily: 'Rubik Mono One', fontSize: 26, letterSpacing: 1, marginTop: 2 }}>ARC RAIDERS</div>
            <div style={{ fontSize: 13, opacity: 0.7, marginTop: 2 }}>lobby 7 · 2h 14m logged · "locked in"</div>
          </div>
        </>
      )}

      {scene === 'just-chatting' && (
        <>
          <LWWebcam palette={palette} x={510} y={110} w={920} h={680} />
          <LWTimer time={uptime} palette={palette} label="ON AIR" />
          <LWAlert alert={alert} palette={palette} />
          <LWGoalBar palette={palette} percent={percent} />
          <LWChat msgs={msgs} palette={palette} />
          <LWTicker palette={palette} />
          <div style={{
            position: 'absolute', top: 150, left: 56, width: 420,
            background: P.paper, color: P.ink, padding: '22px 26px',
            transform: 'rotate(-2deg)',
            boxShadow: '6px 6px 0 rgba(0,0,0,0.6)',
            fontFamily: 'Special Elite',
            zIndex: 30,
          }}>
            <div style={{
              background: P.stamp, color: P.paper, display: 'inline-block',
              padding: '4px 10px', fontFamily: 'JetBrains Mono', fontSize: 12, letterSpacing: 3,
              transform: 'rotate(-3deg)', marginBottom: 10, boxShadow: '2px 2px 0 rgba(0,0,0,0.3)',
            }}>TOPIC · EVIDENCE</div>
            <div style={{ fontFamily: 'Rubik Mono One', fontSize: 44, lineHeight: 1, letterSpacing: 1 }}>
              PIGEONS<br/>ARE <span style={{ background: P.ink, color: P.paper, padding: '0 6px' }}>STATE</span><br/>SURVEILLANCE?
            </div>
            <div style={{ fontSize: 16, marginTop: 14, opacity: 0.8 }}>
              a 3-hour deep dive. bring bread. bring questions. bring an aluminum foil hat.
            </div>
          </div>
        </>
      )}
    </div>
  );
};

Object.assign(window, { DirectionD, LW_PALETTES });
