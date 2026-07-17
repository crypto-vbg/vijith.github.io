import Reveal from "./Reveal.jsx";
import { SITE } from "../site.config.js";
import { GradTitle } from "./text.jsx";

export default function Experience() {
  const xp = SITE.experience;
  return (
    <section id="experience" className="xp-section">
      <div className="container">
        <Reveal>
          <div className="kicker">{xp.kicker}</div>
          <h2 className="section-title">
            <GradTitle text={xp.title} />
          </h2>
          <p className="section-sub">{xp.subtitle}</p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="xp-org">
            <h3>{xp.org}</h3>
            <span className="period">{xp.period}</span>
          </div>
        </Reveal>
        <div className="timeline">
          {xp.items.map((item, i) => (
            <Reveal key={item.title} delay={0.08 * (i % 3)}>
              <div className="xp-item">
                <div className="xp-card">
                  <div className="xp-meta">
                    <span className="xp-role-tag">{item.tag}</span>
                  </div>
                  <h4 className="xp-title">{item.title}</h4>
                  <span className="xp-impact">▲ {item.impact}</span>
                  <p className="xp-desc">{item.desc}</p>
                  <div className="chip-row">
                    {item.chips.map((c) => (
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
