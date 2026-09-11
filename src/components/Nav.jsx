import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SITE } from "../site.config.js";
import { MenuIcon, CloseIcon } from "./Icons.jsx";
import { useMotionPreferences } from "./MotionPreferences.jsx";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const root = useRef(null);
  const burger = useRef(null);
  const { reduced, systemReduced, toggle } = useMotionPreferences();

  useEffect(() => {
    let frame;
    const update = () => {
      setScrolled(window.scrollY > 24);
      const sections = SITE.nav.map(item => document.querySelector(item.href)).filter(Boolean);
      const current = sections.filter(section => section.getBoundingClientRect().top <= 160).at(-1);
      const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 8;
      setActive(atBottom ? SITE.nav.at(-1).href : current ? `#${current.id}` : "");
    };
    const onScroll = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = event => {
      if (event.key === "Escape") { setMenuOpen(false); burger.current?.focus(); }
    };
    const onPointer = event => { if (!root.current?.contains(event.target)) setMenuOpen(false); };
    const wide = window.matchMedia("(min-width: 901px)");
    const onResize = () => { if (wide.matches) setMenuOpen(false); };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    wide.addEventListener("change", onResize);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
      wide.removeEventListener("change", onResize);
    };
  }, [menuOpen]);

  const followSection = href => {
    setMenuOpen(false);
    const section = document.querySelector(href);
    section?.setAttribute("tabindex", "-1");
    section?.focus({ preventScroll: true });
  };

  return (
    <nav ref={root} aria-label="Main navigation" className={`nav ${scrolled || menuOpen ? "scrolled" : ""}`}>
      <div className="nav-inner">
        <a href="#top" className="nav-logo" aria-label={`${SITE.name}, back to top`} onClick={() => setMenuOpen(false)}>{SITE.navLogo}</a>
        <ul className="nav-links">
          {SITE.nav.map(item => (
            <li key={item.href}>
              <a href={item.href} aria-current={active === item.href ? "location" : undefined}>
                {active === item.href && <motion.span className="nav-active" layoutId="active-section" transition={{ duration: reduced ? 0 : 0.25 }} />}
                <span>{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="nav-right">
          <button className="motion-toggle" onClick={toggle} disabled={systemReduced}
            aria-label={systemReduced ? "Reduced motion follows your device setting" : reduced ? "Enable animations" : "Pause animations"}
            aria-pressed={reduced} title={systemReduced ? "Reduced motion follows your device setting" : reduced ? "Enable animations" : "Pause animations"}>
            <span aria-hidden="true">{reduced ? "▷" : "Ⅱ"}</span><span className="motion-label">Motion</span>
          </button>
          <button ref={burger} className="nav-burger" aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(v => !v)}>
            {menuOpen ? <CloseIcon size={18} /> : <MenuIcon size={18} />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {menuOpen && (
          <motion.ul id="mobile-navigation" className="nav-mobile" initial={{ opacity: 0, y: reduced ? 0 : -12 }}
            animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 0.18 }}>
            {SITE.nav.map(item => (
              <li key={item.href}>
                <a href={item.href} aria-current={active === item.href ? "location" : undefined} onClick={() => followSection(item.href)}>{item.label}<span aria-hidden="true">↗</span></a>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </nav>
  );
}
