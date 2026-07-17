import Reveal from "./Reveal.jsx";
import { SITE } from "../site.config.js";
import { GradTitle } from "./text.jsx";

export default function Skills() {
  const { skills } = SITE;
  return (
    <section id="skills" className="skills-section">
      <div className="container">
        <Reveal>
          <div className="kicker">{skills.kicker}</div>
          <h2 className="section-title">
            <GradTitle text={skills.title} />
          </h2>
          <p className="section-sub">{skills.subtitle}</p>
        </Reveal>
        <div className="skill-groups">
          {skills.groups.map((g, i) => (
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
