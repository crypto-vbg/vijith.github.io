import { useEffect, useState } from "react";

const LINKS = [
  ["About", "#about"],
  ["Experience", "#experience"],
  ["Projects", "#projects"],
  ["Skills", "#skills"],
  ["Beyond Code", "#journey"],
  ["Contact", "#contact"],
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-inner">
        <a href="#top" className="nav-logo">
          vijith<em>@</em>ai<em>:~$</em>
        </a>
        <ul className="nav-links">
          {LINKS.map(([label, href]) => (
            <li key={href}>
              <a href={href}>{label}</a>
            </li>
          ))}
        </ul>
        <button
          className="nav-cta"
          onClick={() => window.dispatchEvent(new CustomEvent("open-chatbot"))}
        >
          Ask my AI ✦
        </button>
      </div>
    </nav>
  );
}
