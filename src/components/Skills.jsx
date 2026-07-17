import Reveal from "./Reveal.jsx";
import { SKILL_GROUPS } from "../data/content.js";

export default function Skills() {
  return (
    <section id="skills" className="skills-section">
      <div className="container">
        <Reveal>
          <div className="kicker">04 · Capabilities</div>
          <h2 className="section-title">
            The <span className="grad-text">full stack</span> of modern AI engineering
          </h2>
          <p className="section-sub">
            From agent orchestration to eval harnesses to the cloud infrastructure it all runs
            on — one engineer, the whole lifecycle.
          </p>
        </Reveal>
        <div className="skill-groups">
          {SKILL_GROUPS.map((g, i) => (
            <Reveal key={g.title} delay={0.07 * (i % 2)}>
              <div className="skill-group">
                <h4>
                  <span className="dot" />
                  {g.title}
                </h4>
                <p className="hint">{g.hint}</p>
                <div className="chip-row">
                  {g.chips.map((c) => (
                    <span className="chip" key={c}>{c}</span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
