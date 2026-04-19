// Reusable pigeon SVGs — the mascot. Tinted via prop.

const Pigeon = ({ size = 40, tint, style, crown = false, className }) => {
  const body = tint || 'currentColor';
  const wing = `color-mix(in oklch, ${body} 70%, black)`;
  const beak = '#f0a830';
  return (
    <svg className={className} style={style} width={size} height={size * 0.82} viewBox="0 0 44 36" fill="none">
      <ellipse cx="22" cy="24" rx="14" ry="10" fill={body}/>
      <ellipse cx="14" cy="22" rx="10" ry="5" fill={wing} transform="rotate(-20 14 22)"/>
      <ellipse cx="32" cy="20" rx="8" ry="7" fill={body}/>
      <ellipse cx="39" cy="19" rx="2.5" ry="1.4" fill={beak}/>
      <circle cx="37" cy="17" r="1.8" fill="#cc4400"/>
      <circle cx="37.4" cy="16.6" r="0.7" fill="#111"/>
      <rect x="18" y="33" width="3" height="5" rx="1" fill="#e8885a"/>
      <rect x="24" y="33" width="3" height="5" rx="1" fill="#e8885a"/>
      {crown && (
        <polygon points="26,12 28,7 30,11 32,6 34,10 36,7 36,13" fill="#f0a830"/>
      )}
    </svg>
  );
};

// Silhouette pigeon flying across (decorative).
const PigeonFlyer = ({ top = '20%', duration = 22, delay = 0, size = 50, color = '#2a1848' }) => (
  <svg style={{
    position: 'absolute', top, left: 0,
    animation: `kp-fly ${duration}s linear infinite ${delay}s`,
    opacity: 0.3, pointerEvents: 'none',
  }} width={size} height={size * 0.6} viewBox="0 0 50 30">
    <ellipse cx="25" cy="22" rx="12" ry="6" fill={color}/>
    <ellipse cx="34" cy="18" rx="7" ry="5" fill={color}/>
    <circle cx="38" cy="15" r="4" fill={color}/>
    <path d="M8 18 Q2 10 14 14" stroke={color} strokeWidth="4" fill="none" strokeLinecap="round"/>
    <path d="M32 18 Q38 10 42 15" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round"/>
  </svg>
);

// Keyframes used everywhere.
const PigeonKeyframes = () => (
  <style>{`
    @keyframes kp-fly { from { transform: translateX(-120px); } to { transform: translateX(calc(1920px + 120px)); } }
    @keyframes kp-bob { 0%, 100% { transform: rotate(-3deg) translateY(0); } 50% { transform: rotate(3deg) translateY(-2px); } }
    @keyframes kp-waddle { 0%,100%{ transform: rotate(-4deg) translateY(0); } 50%{ transform: rotate(4deg) translateY(-3px); } }
    @keyframes kp-blink { 0%,100%{ opacity: 0.9; } 50%{ opacity: 0.2; } }
    @keyframes kp-scan { 0%{ transform: translateY(-100%); } 100%{ transform: translateY(100%); } }
    @keyframes kp-alert-in { 0%{ transform: translateX(-110%) rotate(-2deg); opacity: 0; } 60%{ transform: translateX(4%) rotate(0.5deg); opacity: 1; } 100%{ transform: translateX(0) rotate(0deg); opacity: 1; } }
    @keyframes kp-ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
    @keyframes kp-cam-flicker { 0%, 97%, 100% { opacity: 1; } 98% { opacity: 0.6; } 99% { opacity: 0.9; } }
    @keyframes kp-red-blink { 0%,100%{ opacity: 1; } 50%{ opacity: 0.2; } }
  `}</style>
);

Object.assign(window, { Pigeon, PigeonFlyer, PigeonKeyframes });
