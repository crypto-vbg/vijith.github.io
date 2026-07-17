import Reveal from "./Reveal.jsx";
import { IDENTITY_CARDS } from "../data/content.js";

export default function About() {
  return (
    <section id="about">
      <div className="container">
        <Reveal>
          <div className="kicker">01 · Who I am</div>
          <h2 className="section-title">
            From ambiguous problem to <span className="grad-text">production AI</span>
          </h2>
        </Reveal>
        <div className="about-grid">
          <Reveal delay={0.1}>
            <p className="about-lead">
              I'm an AI Lead Engineer at GSK with 2.5+ years designing, architecting and
              delivering enterprise-scale Generative AI products — from concept to production.
            </p>
            <p className="about-body">
              My work spans the complete AI product lifecycle: solution architecture, agent
              design, backend and frontend engineering, deployment, evaluation and production
              operations. I've built multi-agent systems, enterprise RAG platforms,
              conversational NL-to-SQL analytics, LLM fine-tuning pipelines and AI governance
              frameworks — working with GPT, Claude and Gemini.
            </p>
            <p className="about-body">
              Beyond engineering, I lead cross-functional pods of UX designers, engineers,
              architects and product managers, partnering directly with Finance, Legal and
              Commercial stakeholders. The result: enterprise workflows that took weeks now run
              in minutes — with security, RBAC, Responsible AI compliance and observability
              built in from day one.
            </p>
            <p className="about-body">
              Databricks Certified Generative AI Engineer · IEEE-published researcher ·
              4× Silver + Bronze awards at GSK.
            </p>
          </Reveal>
          <div className="about-cards">
            {IDENTITY_CARDS.map((c, i) => (
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
