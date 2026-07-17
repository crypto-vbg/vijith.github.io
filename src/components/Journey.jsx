import Reveal from "./Reveal.jsx";
import { SITE } from "../site.config.js";

// Deterministic pseudo-random star field (stable across renders).
const STARS = Array.from({ length: 90 }, (_, i) => {
  const a = Math.sin(i * 127.1) * 43758.5453;
  const b = Math.sin(i * 311.7) * 12543.8567;
  return {
    x: Math.abs(a - Math.floor(a)) * 100,
    y: Math.abs(b - Math.floor(b)) * 55,
    r: 0.6 + Math.abs(Math.sin(i * 3.7)) * 1.3,
    d: (i % 7) * 0.6,
  };
});

const ROAD_PATH =
  "M -60,600 C 240,560 380,470 560,455 C 760,438 820,520 1040,505 C 1260,490 1360,430 1520,438";

function Scene() {
  return (
    <>
      {/* early-dusk stars + low golden sun */}
      <svg className="journey-stars" viewBox="0 0 1440 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <radialGradient id="sunGlow">
            <stop offset="0%" stopColor="rgba(255,202,122,0.55)" />
            <stop offset="55%" stopColor="rgba(255,180,100,0.18)" />
            <stop offset="100%" stopColor="rgba(255,180,100,0)" />
          </radialGradient>
        </defs>
        {STARS.map((s, i) => (
          <circle
            key={i}
            cx={(s.x / 100) * 1440}
            cy={(s.y / 100) * 600}
            r={s.r}
            fill="#ffe3b8"
            className="star"
            style={{ animationDelay: `${s.d}s` }}
          />
        ))}
        <circle cx="1150" cy="160" r="120" fill="url(#sunGlow)" />
        <circle cx="1150" cy="160" r="36" fill="#ffdfae" opacity="0.95" />
        <g className="cloud c1">
          <ellipse cx="300" cy="150" rx="130" ry="26" fill="rgba(255,214,170,0.12)" />
          <ellipse cx="360" cy="132" rx="80" ry="20" fill="rgba(255,214,170,0.09)" />
        </g>
        <g className="cloud c2">
          <ellipse cx="900" cy="210" rx="160" ry="24" fill="rgba(255,190,150,0.12)" />
          <ellipse cx="960" cy="192" rx="90" ry="18" fill="rgba(255,190,150,0.08)" />
        </g>
      </svg>

      {/* layered mountains + road + rider */}
      <svg className="journey-svg" viewBox="0 0 1440 600" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
        {/* far range — sun-hazed */}
        <path
          d="M0,600 L0,330 C90,300 170,240 260,255 C360,272 420,205 520,215 C640,228 700,160 810,185 C930,212 1000,150 1120,175 C1240,200 1320,140 1440,170 L1440,600 Z"
          fill="#6e4234" opacity="0.85"
        />
        {/* mid range */}
        <path
          d="M0,600 L0,400 C120,370 200,310 320,330 C440,350 520,280 640,300 C780,323 850,255 980,285 C1120,317 1200,260 1440,310 L1440,600 Z"
          fill="#45261a"
        />
        {/* near hills */}
        <path
          d="M0,600 L0,480 C180,440 300,470 460,450 C640,428 760,475 940,460 C1140,443 1260,478 1440,455 L1440,600 Z"
          fill="#291610"
        />
        {/* pines */}
        {[
          [120, 470], [160, 482], [520, 452], [560, 462], [1180, 468], [1225, 478], [880, 468],
        ].map(([x, y], i) => (
          <g key={i} transform={`translate(${x} ${y})`} fill="#170d07">
            <path d="M0,0 L10,22 L-10,22 Z" />
            <path d="M0,10 L13,34 L-13,34 Z" />
            <rect x="-2" y="34" width="4" height="8" />
          </g>
        ))}
        {/* prayer flags strung roadside — straight out of the film */}
        <g>
          <rect x="938.5" y="400" width="3" height="70" fill="#170d07" />
          <rect x="1198.5" y="395" width="3" height="70" fill="#170d07" />
          <path d="M 940,400 Q 1070,425 1200,395" fill="none" stroke="#170d07" strokeWidth="1.6" />
          {[
            [979, 406, "#e8875f", -4], [1018, 410, "#efe6d8", 3], [1057, 411, "#f2b880", -3],
            [1096, 410, "#e9a1a8", 4], [1135, 407, "#efe6d8", -3], [1174, 400, "#e8875f", 3],
          ].map(([x, y, c, rot], i) => (
            <rect
              key={i}
              x={x - 5.5} y={y} width="11" height="13"
              fill={c} opacity="0.85"
              transform={`rotate(${rot} ${x} ${y})`}
            />
          ))}
        </g>
        {/* road */}
        <path d={ROAD_PATH} fill="none" stroke="#1b100a" strokeWidth="30" strokeLinecap="round" />
        <path
          d={ROAD_PATH}
          fill="none" stroke="rgba(242,184,128,0.55)" strokeWidth="2.5"
          strokeDasharray="14 20" className="road-dash"
        />
        {/* rider */}
        <g className="rider">
          <g>
            {/* headlight beam */}
            <path d="M8,-4 L58,-14 L58,8 L8,4 Z" fill="url(#beam)" opacity="0.8" />
            {/* bike + rider silhouette */}
            <circle cx="-7" cy="4" r="5" fill="#140b06" stroke="#f2b880" strokeWidth="0.8" />
            <circle cx="7" cy="4" r="5" fill="#140b06" stroke="#f2b880" strokeWidth="0.8" />
            <path d="M-7,4 L-2,-2 L4,-2 L7,4 M-2,-2 L-4,-8 L1,-9 L3,-4" stroke="#140b06" strokeWidth="2.4" fill="none" strokeLinecap="round" />
            <circle cx="-4" cy="-11" r="2.6" fill="#140b06" />
            <circle cx="8" cy="0" r="1.8" fill="#ffe9b3" className="headlight" />
          </g>
          <animateMotion dur="16s" repeatCount="indefinite" rotate="auto" path={ROAD_PATH} />
        </g>
        <defs>
          <linearGradient id="beam" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(255,233,179,0.5)" />
            <stop offset="100%" stopColor="rgba(255,233,179,0)" />
          </linearGradient>
        </defs>
        {/* fireflies */}
        {[
          [220, 520, 0], [340, 540, 1.2], [720, 530, 0.6], [1060, 525, 1.8], [1320, 540, 0.3],
        ].map(([x, y, d], i) => (
          <circle key={i} cx={x} cy={y} r="2" fill="#ffe9a3" className="firefly" style={{ animationDelay: `${d}s` }} />
        ))}
      </svg>
    </>
  );
}

export default function Journey() {
  const { journey } = SITE;
  return (
    <section id="journey" className="journey-section">
      <div className="journey-scene">
        <Scene />
        <div className="journey-copy">
          <Reveal>
            <div className="kicker" style={{ justifyContent: "center" }}>
              {journey.kicker}
            </div>
            <h2 className="section-title">
              {journey.titleLine1}
              <br />
              <span style={{ color: "#ffd9a0" }}>{journey.titleLine2}</span>
            </h2>
            <p>{journey.text}</p>
          </Reveal>
        </div>
      </div>
      <div className="journey-interests">
        <div className="interest-grid">
          {journey.interests.map((it, i) => (
            <Reveal key={it.title} delay={0.08 * i}>
              <div className="interest-card">
                <span className="emoji">{it.emoji}</span>
                <b>{it.title}</b>
                <span>{it.desc}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
