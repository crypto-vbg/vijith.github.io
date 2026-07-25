import { useEffect, useState } from "react";

/**
 * True on phones / reduced-motion — heavy or pointer-driven effects opt out.
 * Shared guard so every animated component makes the same call in one place.
 */
export function useLiteMode() {
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
