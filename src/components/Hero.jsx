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

/** Neural-network particle field (desktop only). */
function NeuralCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    let raf;
    let running = true;
    let particles = [];
    const DPR = Math.min(window.devicePixelRatio || 1, 1.5);
    const mouse = { x: -9999, y: -9999 };

    const resize = () => {
      canvas.width = canvas.offsetWidth * DPR;
      canvas.height = canvas.offsetHeight * DPR;
      const count = Math.min(110, Math.floor(canvas.offsetWidth / 14));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.22 * DPR,
        vy: (Math.random() - 0.5) * 0.22 * DPR,
        r: (Math.random() * 1.4 + 0.6) * DPR,
      }));
    };

    const onMouse = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = (e.clientX - rect.left) * DPR;
      mouse.y = (e.clientY - rect.top) * DPR;
    };

    const LINK = 130;
    const draw = () => {
      if (!running) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      }
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < LINK * DPR) {
            const alpha = (1 - d / (LINK * DPR)) * 0.16;
            ctx.strokeStyle = `rgba(125, 211, 252, ${alpha})`;
            ctx.lineWidth = DPR * 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        const dm = Math.hypot(a.x - mouse.x, a.y - mouse.y);
        if (dm < 170 * DPR) {
          ctx.strokeStyle = `rgba(167, 139, 250, ${(1 - dm / (170 * DPR)) * 0.35})`;
          ctx.lineWidth = DPR * 0.7;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
        ctx.fillStyle = "rgba(190, 220, 255, 0.75)";
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    // stop burning GPU once the hero is scrolled out of view
    const io = new IntersectionObserver(([entry]) => {
      const wasRunning = running;
      running = entry.isIntersecting;
      if (running && !wasRunning) draw();
      if (!running) cancelAnimationFrame(raf);
    });
    io.observe(canvas);
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouse);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);
  return <canvas ref={ref} className="hero-canvas" aria-hidden="true" />;
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
      {!lite && <NeuralCanvas />}
      <div className="hero-glow one" />
      <div className="hero-glow two" />
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
