import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import Markdown from "./Chatbot/Markdown.jsx";
import { useLiteMode } from "./useLiteMode.js";

/** Splits a segment into per-character spans; spaces stay plain text so the
 *  title still wraps naturally. */
function chars(seg, accent, keyBase) {
  return seg.split(/(\s+)/).map((word, w) => /^\s+$/.test(word) ? word : (
    <span className="g-word" key={`${keyBase}-${w}`}>
      {[...word].map((ch, i) => <span className={accent ? "g-char grad-text" : "g-char"}
        style={{ opacity: 0 }} key={i}>{ch}</span>)}
    </span>
  ));
}

/**
 * Renders a config title string; *starred* segments get the gradient accent.
 * On scroll-into-view the characters cascade in (anime.js stagger + blur).
 * Phones / reduced-motion render the plain, fully-visible title.
 */
export function GradTitle({ text }) {
  const lite = useLiteMode();
  const ref = useRef(null);

  useEffect(() => {
    if (lite) return;
    const el = ref.current;
    if (!el) return;
    const targets = el.querySelectorAll(".g-char");
    if (!targets.length) return;
    let animation;
    const io = new IntersectionObserver(
      ([entry], obs) => {
        if (!entry.isIntersecting) return;
        animation = animate(targets, {
          opacity: [0, 1],
          translateY: ["0.45em", "0em"],
          filter: ["blur(7px)", "blur(0px)"],
          delay: stagger(14),
          duration: 720,
          ease: "outExpo",
        });
        obs.disconnect();
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => { io.disconnect(); animation?.pause(); };
  }, [lite, text]);

  if (lite) {
    return text
      .split("*")
      .map((seg, i) =>
        i % 2 ? (
          <span className="grad-text" key={i}>
            {seg}
          </span>
        ) : (
          seg
        )
      );
  }

  return (
    <span ref={ref} className="grad-title-wrap">
      <span className="sr-only">{text.replaceAll("*", "")}</span>
      <span aria-hidden="true">{text.split("*").map((seg, i) => chars(seg, i % 2 === 1, i))}</span>
    </span>
  );
}

/** Renders a config paragraph string with light Markdown (bold, links, bullets). */
export function RichText({ text }) {
  return <Markdown text={text} />;
}
