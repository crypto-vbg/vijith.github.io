import Reveal from "./Reveal.jsx";
import { SITE } from "../site.config.js";
import { GradTitle } from "./text.jsx";

export default function Contact() {
  const { contact } = SITE;
  return (
    <section id="contact">
      <div className="container contact-wrap">
        <Reveal>
          <div className="kicker" style={{ justifyContent: "center" }}>
            {contact.kicker}
          </div>
          <h2 className="section-title">
            <GradTitle text={contact.title} />
          </h2>
          <p className="section-sub">{contact.subtitle}</p>
          <div className="contact-links">
            {contact.buttons.map((b) => (
              <a
                key={b.label}
                className={b.primary ? "btn-primary" : "btn-ghost"}
                href={b.href}
                target="_blank"
                rel="noreferrer"
              >
                {b.label}
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
