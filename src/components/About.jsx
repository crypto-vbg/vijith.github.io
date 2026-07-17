import Reveal from "./Reveal.jsx";
import { SITE } from "../site.config.js";
import { GradTitle, RichText } from "./text.jsx";

export default function About() {
  const { about } = SITE;
  return (
    <section id="about">
      <div className="container">
        <Reveal>
          <div className="kicker">{about.kicker}</div>
          <h2 className="section-title">
            <GradTitle text={about.title} />
          </h2>
        </Reveal>
        <div className="about-grid">
          <Reveal delay={0.1}>
            <div className="about-copy">
              {about.paragraphs.map((p, i) => (
                <div className={i === 0 ? "about-lead" : "about-body"} key={i}>
                  <RichText text={p} />
                </div>
              ))}
            </div>
          </Reveal>
          <div className="about-cards">
            {about.cards.map((c, i) => (
              <Reveal key={c.title} delay={0.12 + i * 0.08}>
                <div className="id-card">
                  <span className="icon">{c.icon}</span>
                  <div>
                    <b>{c.title}</b>
                    <span>{c.desc}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
