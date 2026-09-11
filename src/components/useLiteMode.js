import { useEffect, useState } from "react";
import { useMotionPreferences } from "./MotionPreferences.jsx";

/**
 * True on phones / reduced-motion — heavy or pointer-driven effects opt out.
 * Shared guard so every animated component makes the same call in one place.
 */
export function useLiteMode() {
  const [lite, setLite] = useState(true);
  const { reduced } = useMotionPreferences();
  useEffect(() => {
    const check = () =>
      setLite(
        window.matchMedia("(max-width: 820px)").matches ||
          window.matchMedia("(pointer: coarse)").matches ||
          Boolean(navigator.connection?.saveData)
      );
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return lite || reduced;
}
