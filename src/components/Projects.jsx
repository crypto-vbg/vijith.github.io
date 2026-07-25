import Reveal from "./Reveal.jsx";
import { SITE } from "../site.config.js";
import { GradTitle } from "./text.jsx";

/** Small animated SVG motifs that give each project card life. */
function Viz({ type }) {
  if (type === "constellation") {
    const nodes = [
      [30, 70], [90, 30], [150, 80], [210, 40], [270, 90],
      [120, 100], [190, 95], [250, 35], [60, 35],
    ];
    const edges = [[0, 8], [8, 1], [1, 2], [2, 5], [2, 3], [3, 7], [3, 6], [6, 4], [5, 0]];
    return (
      <svg viewBox="0 0 300 120" preserveAspectRatio="xMidYMid slice" className="viz-svg">
        {edges.map(([a, b], i) => (
          <line
            key={i}
            x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]}
            stroke="rgba(242,184,128,0.35)" strokeWidth="1"
            className="viz-edge" style={{ animationDelay: `${i * 0.25}s` }}
          />
        ))}
        {nodes.map(([x, y], i) => (
          <circle
            key={i} cx={x} cy={y} r={i % 3 === 0 ? 4 : 2.5}
            fill={i % 2 ? "#f2b880" : "#e8875f"}
            className="viz-node" style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </svg>
    );
  }
  if (type === "loss") {
    return (
      <svg viewBox="0 0 300 120" preserveAspectRatio="none" className="viz-svg">
        <path
          d="M10,18 C60,24 70,55 110,66 C150,77 170,88 200,94 C240,101 270,103 292,104"
          fill="none" stroke="#e8875f" strokeWidth="2.5" className="viz-draw"
        />
        <path
          d="M10,40 C60,50 90,72 130,82 C170,92 220,99 292,103"
          fill="none" stroke="rgba(242,184,128,0.55)" strokeWidth="1.5"
          strokeDasharray="4 5" className="viz-draw slow"
        />
        <text x="16" y="16" fill="#7a6c5a" fontSize="9" fontFamily="JetBrains Mono">loss ↓ · +30% domain accuracy</text>
      </svg>
    );
  }
  if (type === "chat") {
    return (
      <svg viewBox="0 0 300 120" className="viz-svg">
        <rect x="18" y="16" rx="9" width="150" height="24" fill="rgba(242,184,128,0.14)" className="viz-bubble" />
        <rect x="132" y="50" rx="9" width="150" height="24" fill="rgba(232,135,95,0.18)" className="viz-bubble d1" />
        <rect x="18" y="84" rx="9" width="110" height="22" fill="rgba(242,184,128,0.14)" className="viz-bubble d2" />
        <circle cx="272" cy="97" r="4" fill="#f2b880" className="viz-node" />
        <circle cx="284" cy="97" r="4" fill="#e8875f" className="viz-node" style={{ animationDelay: "0.3s" }} />
      </svg>
    );
  }
  // commits
  return (
    <svg viewBox="0 0 300 120" className="viz-svg">
      {Array.from({ length: 13 }).map((_, col) =>
        Array.from({ length: 4 }).map((_, row) => {
          const seed = (col * 7 + row * 13) % 10;
          const on = seed > 3;
          return (
            <rect
              key={`${col}-${row}`}
              x={20 + col * 20} y={20 + row * 20} width="14" height="14" rx="3"
              fill={on ? (seed > 7 ? "#f2b880" : "rgba(242,184,128,0.35)") : "rgba(255,240,224,0.06)"}
              className={on ? "viz-cell" : ""}
              style={{ animationDelay: `${(col + row) * 0.12}s` }}
            />
          );
        })
      )}
    </svg>
  );
}

export default function Projects() {
  const { projects } = SITE;
  return (
    <section id="projects">
      <div className="container">
        <Reveal>
          <div className="kicker">{projects.kicker}</div>
          <h2 className="section-title">
            <GradTitle text={projects.title} />
          </h2>
          <p className="section-sub">{projects.subtitle}</p>
        </Reveal>
        <div className="proj-grid">
          {projects.items.map((p, i) => (
            <Reveal key={p.title} delay={0.08 * (i % 2)}>
              <div className="proj-card glow-card">
                <div className="beam" />
                <div className="proj-viz">
                  <Viz type={p.viz} />
                </div>
                <span className="proj-tag">{p.tag}</span>
                <h4 className="proj-title">{p.title}</h4>
                <p className="proj-desc">{p.desc}</p>
                <div className="chip-row" style={{ marginBottom: p.link ? 16 : 0 }}>
                  {p.chips.map((c) => (
                    <span className="chip" key={c}>{c}</span>
                  ))}
                </div>
                {p.link && (
                  <a className="proj-link" href={p.link} target="_blank" rel="noreferrer">
                    {p.linkLabel}
                  </a>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
