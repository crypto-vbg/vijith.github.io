import Reveal from "./Reveal.jsx";
import { LINKS } from "../data/content.js";

export default function Contact() {
  return (
    <section id="contact">
      <div className="container contact-wrap">
        <Reveal>
          <div className="kicker" style={{ justifyContent: "center" }}>
            06 · Contact
          </div>
          <h2 className="section-title">
            Let's build something <span className="grad-text">intelligent</span>
          </h2>
          <p className="section-sub">
            Open to conversations about Generative AI, agentic systems and hard problems worth
            solving. The fastest way to learn about my work? Ask the AI assistant in the corner
            — I built it.
          </p>
          <div className="contact-links">
            <a className="btn-primary" href={`mailto:${LINKS.email}`}>
              ✉ {LINKS.email}
            </a>
            <a className="btn-ghost" href={LINKS.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a className="btn-ghost" href={LINKS.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
