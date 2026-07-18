/* Themed inline SVG icons — replaces the old emoji / unicode glyphs.
   Stroke icons inherit `currentColor`; the About-card set uses the brand
   amber→ember gradient to match the site grade. */

function Svg({ size = 22, viewBox = "0 0 24 24", className, children, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      fill="none"
      aria-hidden="true"
      className={className}
      {...rest}
    >
      {children}
    </svg>
  );
}

const Grad = ({ id }) => (
  <defs>
    <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#f2b880" />
      <stop offset="100%" stopColor="#e8875f" />
    </linearGradient>
  </defs>
);

const stroke = (paint) => ({
  stroke: paint,
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
});

/* ---- About cards (was 🧠 🤝 🛡️ ⚡) ---- */

export function NetworkIcon(props) {
  return (
    <Svg {...props}>
      <Grad id="ig-net" />
      <g {...stroke("url(#ig-net)")}>
        <circle cx="5" cy="5.5" r="2.3" />
        <circle cx="5" cy="18.5" r="2.3" />
        <circle cx="18.4" cy="12" r="2.8" />
        <path d="M7.2 6.6 C11.5 8.2 12 9.6 15.7 11" />
        <path d="M7.2 17.4 C11.5 15.8 12 14.4 15.7 13" />
      </g>
    </Svg>
  );
}

export function PartnersIcon(props) {
  return (
    <Svg {...props}>
      <Grad id="ig-par" />
      <g {...stroke("url(#ig-par)")}>
        <circle cx="9" cy="7.5" r="3.2" />
        <path d="M3.5 19.5 c0 -3.2 2.5 -5.2 5.5 -5.2 s5.5 2 5.5 5.2" />
        <circle cx="17" cy="8.5" r="2.4" />
        <path d="M16.4 14.6 c2.6 0.3 4.2 2.1 4.2 4.9" />
      </g>
    </Svg>
  );
}

export function ShieldIcon(props) {
  return (
    <Svg {...props}>
      <Grad id="ig-shl" />
      <g {...stroke("url(#ig-shl)")}>
        <path d="M12 3 L19 5.8 V11 c0 4.8 -3 8.4 -7 10 c-4 -1.6 -7 -5.2 -7 -10 V5.8 Z" />
        <path d="M9.2 11.6 l2 2 l3.8 -4.4" />
      </g>
    </Svg>
  );
}

export function BoltIcon(props) {
  return (
    <Svg {...props}>
      <Grad id="ig-blt" />
      <path
        d="M13 2.5 L5.2 13.5 h5.3 L10 21.5 l8.6 -11.5 H13.2 Z"
        fill="url(#ig-blt)"
        stroke="url(#ig-blt)"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/* ---- Journey interests (was 🏍️ ⛰️ 🛣️ 🌲) ---- */

export function MotorcycleIcon(props) {
  return (
    <Svg {...props}>
      <Grad id="ig-bike" />
      <g {...stroke("url(#ig-bike)")}>
        <circle cx="5.5" cy="16.5" r="2.9" />
        <circle cx="18.5" cy="16.5" r="2.9" />
        <path d="M5.5 16.5 L9.3 10.8 H14 L18.5 16.5" />
        <path d="M14 10.8 L12.4 7.6 L15.4 7" />
        <path d="M9.3 10.8 L7.2 9.6" />
      </g>
    </Svg>
  );
}

export function MountainIcon(props) {
  return (
    <Svg {...props}>
      <Grad id="ig-mtn" />
      <g {...stroke("url(#ig-mtn)")}>
        <path d="M3 19 H21 L14.5 6.5 L11.2 12.8 L8.5 9 Z" />
        <circle cx="5.8" cy="5.8" r="1.7" />
      </g>
    </Svg>
  );
}

export function RoadIcon(props) {
  return (
    <Svg {...props}>
      <Grad id="ig-road" />
      <g {...stroke("url(#ig-road)")}>
        <path d="M9.5 4 L5.5 20 M14.5 4 L18.5 20" />
        <path d="M12 5.5 v2.3 M12 11.2 v2.8 M12 17.4 v2.6" />
      </g>
    </Svg>
  );
}

export function PineIcon(props) {
  return (
    <Svg {...props}>
      <Grad id="ig-pine" />
      <g {...stroke("url(#ig-pine)")}>
        <path d="M12 3 L16.6 9.8 H7.4 Z" />
        <path d="M12 7.8 L18 15.8 H6 Z" />
        <path d="M12 15.8 V20.5" />
      </g>
    </Svg>
  );
}

export const CARD_ICONS = {
  network: NetworkIcon,
  partners: PartnersIcon,
  shield: ShieldIcon,
  bolt: BoltIcon,
};

export const INTEREST_ICONS = {
  bike: MotorcycleIcon,
  mountain: MountainIcon,
  road: RoadIcon,
  pine: PineIcon,
};

/* ---- UI glyphs ---- */

export function CloseIcon(props) {
  return (
    <Svg {...props}>
      <path d="M6 6 L18 18 M18 6 L6 18" {...stroke("currentColor")} strokeWidth="2" />
    </Svg>
  );
}

export function MenuIcon(props) {
  return (
    <Svg {...props}>
      <path d="M4 7 h16 M4 12 h16 M4 17 h16" {...stroke("currentColor")} strokeWidth="2" />
    </Svg>
  );
}

export function ResetIcon(props) {
  return (
    <Svg {...props}>
      <g {...stroke("currentColor")}>
        <path d="M3.5 4.5 V10 H9" />
        <path d="M5.6 14.8 a7.2 7.2 0 1 0 1.7 -7.6 L3.5 10" />
      </g>
    </Svg>
  );
}

export function SendIcon(props) {
  return (
    <Svg {...props}>
      <g {...stroke("currentColor")}>
        <path d="M21 3.5 L10.8 13.7" />
        <path d="M21 3.5 L14.6 20.5 L10.8 13.7 L4 9.9 Z" />
      </g>
    </Svg>
  );
}

export function StopIcon(props) {
  return (
    <Svg {...props}>
      <rect x="7" y="7" width="10" height="10" rx="2" fill="currentColor" />
    </Svg>
  );
}

export function HourglassIcon(props) {
  return (
    <Svg {...props}>
      <g {...stroke("currentColor")} strokeWidth="1.6">
        <path d="M7 3.5 h10 M7 20.5 h10" />
        <path d="M8.5 3.5 v2 c0 2.9 3.5 3.6 3.5 6.5 s-3.5 3.6 -3.5 6.5 v2" />
        <path d="M15.5 3.5 v2 c0 2.9 -3.5 3.6 -3.5 6.5 s3.5 3.6 3.5 6.5 v2" />
      </g>
    </Svg>
  );
}

export function TrendUpIcon(props) {
  return (
    <Svg {...props}>
      <g {...stroke("currentColor")} strokeWidth="2">
        <path d="M3 16.5 L9.5 10 L13.5 14 L21 6.5" />
        <path d="M15.5 6.5 H21 V12" />
      </g>
    </Svg>
  );
}

/* ---- brand monogram (the approved favicon "V", self-drawing) ----
   dark: charcoal glyph for gradient backgrounds (FAB);
   default: gradient glyph for dark surfaces (avatar). */
export function Monogram({ size = 38, dark = false, className }) {
  const ink = dark ? "#1c120b" : undefined;
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true" className={className}>
      {!dark && (
        <defs>
          <linearGradient id="vmono-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f2b880" />
            <stop offset="100%" stopColor="#e8875f" />
          </linearGradient>
        </defs>
      )}
      <path
        className="mono-draw"
        d="M14 18 L26 46 L32 32"
        pathLength="100"
        fill="none"
        stroke={ink ?? "url(#vmono-g)"}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle className="mono-dot-a" cx="44" cy="24" r="4" fill={ink ?? "#f2b880"} />
      <circle className="mono-dot-b" cx="49" cy="37" r="2.6" fill={ink ?? "#e9a1a8"} />
    </svg>
  );
}
