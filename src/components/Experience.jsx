import Reveal from "./Reveal.jsx";
import { EXPERIENCE } from "../data/content.js";

export default function Experience() {
  return (
    <section id="experience" className="xp-section">
      <div className="container">
        <Reveal>
          <div className="kicker">02 · Experience</div>
          <h2 className="section-title">
            Enterprise AI, <span className="grad-text">shipped and adopted</span>
          </h2>
          <p className="section-sub">
            Every system below runs in production at GSK — used daily by finance, legal and
            commercial teams, compressing weeks of manual work into minutes.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="xp-org">
            <h3>GSK (GlaxoSmithKline)</h3>
            <span className="period">AI Lead Engineer, Global Functions · Jan 2024 — Present</span>
          </div>
        </Reveal>
        <div className="timeline">
          {EXPERIENCE.map((xp, i) => (
            <Reveal key={xp.title} delay={0.08 * (i % 3)}>
              <div className="xp-item">
                <div className="xp-card">
                  <div className="xp-meta">
                    <span className="xp-role-tag">{xp.tag}</span>
                  </div>
                  <h4 className="xp-title">{xp.title}</h4>
                  <span className="xp-impact">▲ {xp.impact}</span>
                  <p className="xp-desc">{xp.desc}</p>
                  <div className="chip-row">
                    {xp.chips.map((c) => (
                      <span className="chip" key={c}>{c}</span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
