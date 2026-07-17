import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { SITE } from "../site.config.js";
import { RichText } from "./text.jsx";

function useTypewriter(words) {
  const [text, setText] = useState("");
  useEffect(() => {
    let word = 0;
    let char = 0;
    let deleting = false;
    let timer;
    const tick = () => {
      const current = words[word];
      if (!deleting) {
        char++;
        setText(current.slice(0, char));
        if (char === current.length) {
          deleting = true;
          timer = setTimeout(tick, 2200);
          return;
        }
        timer = setTimeout(tick, 55);
      } else {
        char--;
        setText(current.slice(0, char));
        if (char === 0) {
          deleting = false;
          word = (word + 1) % words.length;
        }
        timer = setTimeout(tick, 28);
      }
    };
    timer = setTimeout(tick, 400);
    return () => clearTimeout(timer);
  }, [words]);
  return text;
}

/** True on phones / reduced-motion — heavy effects are skipped entirely. */
function useLiteMode() {
  const [lite, setLite] = useState(true);
  useEffect(() => {
    const check = () =>
      setLite(
        window.matchMedia("(max-width: 820px)").matches ||
          window.matchMedia("(prefers-reduced-motion: reduce)").matches
      );
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return lite;
}

/**
 * Full-bleed cinematic backdrop — the film the whole page is graded to match.
 * Desktop plays the clip slowed down with a slow Ken Burns drift; phones and
 * reduced-motion get the poster frame only (no 7 MB download). Playback pauses
 * once the hero scrolls out of view.
 */
function FilmBackdrop({ film, lite }) {
  const ref = useRef(null);
  useEffect(() => {
    if (lite) return;
    const video = ref.current;
    if (!video) return;
    video.playbackRate = 0.75;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    });
    io.observe(video);
    return () => io.disconnect();
  }, [lite]);
  return (
    <div className="hero-film" aria-hidden="true">
      {lite ? (
        <div
          className="hero-film-poster"
          style={{ backgroundImage: `url(${film.poster})` }}
        />
      ) : (
        <video
          ref={ref}
          src={film.src}
          poster={film.poster}
          muted
          loop
          autoPlay
          playsInline
          preload="auto"
        />
      )}
      <div className="hero-scrim" />
    </div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.12 * i, duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Hero() {
  const { hero } = SITE;
  const role = useTypewriter(hero.roles);
  const lite = useLiteMode();
  return (
    <section className="hero" id="top">
      <FilmBackdrop film={hero.film} lite={lite} />
      <div className="hero-inner">
        <motion.div initial="hidden" animate="show">
          <motion.div className="hero-badge" variants={fadeUp} custom={0}>
            <span className="pulse-dot" />
            {hero.badge}
          </motion.div>
          <motion.h1 className="hero-title" variants={fadeUp} custom={1}>
            {hero.titleFirst} <span className="grad-text">{hero.titleAccent}</span>
          </motion.h1>
          <motion.div className="hero-role" variants={fadeUp} custom={2}>
            <span className="grad-text">{role}</span>
            <span className="cursor" />
          </motion.div>
          <motion.div className="hero-desc" variants={fadeUp} custom={3}>
            <RichText text={hero.description} />
          </motion.div>
          <motion.div className="hero-actions" variants={fadeUp} custom={4}>
            <a className="btn-primary" href="#experience">
              {hero.ctaSecondary}
            </a>
          </motion.div>
          <motion.div className="hero-stats" variants={fadeUp} custom={5}>
            {hero.stats.map((s) => (
              <div className="hero-stat" key={s.label}>
                <b className="grad-text">{s.value}</b>
                <span>{s.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
