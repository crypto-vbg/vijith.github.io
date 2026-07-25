import { useEffect } from "react";
import { useLiteMode } from "./useLiteMode.js";

/**
 * One delegated pointer listener that paints a soft accent glow tracking the
 * cursor across any `.glow-card` on the page — the kokonut-style spotlight,
 * driven entirely by two CSS custom properties. Skipped on phones /
 * reduced-motion. Cheap enough for a document-level listener: closest() + a
 * style write, no React state, no per-card effects.
 */
export function useCardSpotlight() {
  const lite = useLiteMode();
  useEffect(() => {
    if (lite) return;
    const onMove = (e) => {
      const card = e.target.closest?.(".glow-card");
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
      card.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => document.removeEventListener("pointermove", onMove);
  }, [lite]);
}
