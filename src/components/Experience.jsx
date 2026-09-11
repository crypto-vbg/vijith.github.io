import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Reveal from "./Reveal.jsx";
import { SITE } from "../site.config.js";
import { GradTitle } from "./text.jsx";
import { TrendUpIcon } from "./Icons.jsx";
import { useMotionPreferences } from "./MotionPreferences.jsx";

function ExperienceCard({ item, xp }) {
  const [expanded, setExpanded] = useState(false);
  const id = useId();
  const { reduced } = useMotionPreferences();
  return (
    <article className="xp-item">
      <div className={`xp-card glow-card ${expanded ? 'is-expanded' : ''}`}>
        <div className="xp-meta"><span className="xp-role-tag">{item.tag}</span></div>
        <h4 className="xp-title">{item.title}</h4>
        <span className="xp-impact"><TrendUpIcon size={13} /> {item.impact}</span>
        <p className="xp-desc">{item.summary}</p>
        <div className="chip-row">{item.chips.map(c => <span className="chip" key={c}>{c}</span>)}</div>
        <button className="xp-disclosure" aria-expanded={expanded} aria-controls={id} onClick={() => setExpanded(v => !v)}>
          {expanded ? xp.closeLabel : xp.detailsLabel}<span aria-hidden="true">{expanded ? '−' : '+'}</span>
        </button>
        <AnimatePresence initial={false}>
          {expanded && <motion.div id={id} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: reduced ? 0 : 0.24 }} className="xp-details">
            <p>{item.desc}</p>
          </motion.div>}
        </AnimatePresence>
      </div>
    </article>
  );
}

export default function Experience() {
  const xp = SITE.experience;
  return (
    <section id="experience" className="xp-section">
      <div className="container">
        <Reveal>
          <div className="kicker">{xp.kicker}</div>
          <h2 className="section-title"><GradTitle text={xp.title} /></h2>
          <p className="section-sub">{xp.subtitle}</p>
        </Reveal>
        <Reveal delay={0.1}><div className="xp-org"><h3>{xp.org}</h3><span className="period">{xp.period}</span></div></Reveal>
        <div className="timeline">
          {xp.items.map((item, i) => <Reveal key={item.title} delay={0.05 * (i % 3)}><ExperienceCard item={item} xp={xp} /></Reveal>)}
        </div>
      </div>
    </section>
  );
}
