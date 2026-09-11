import { createContext, useContext, useEffect, useState } from "react";
import { MotionConfig, useReducedMotion } from "framer-motion";

const MotionContext = createContext({ reduced: false, paused: false, toggle: () => {} });

export function MotionPreferences({ children }) {
  const systemReduced = useReducedMotion();
  const [paused, setPaused] = useState(() => {
    try { return localStorage.getItem("portfolio-motion") === "paused"; }
    catch { return false; }
  });
  const reduced = Boolean(systemReduced || paused);
  useEffect(() => {
    document.documentElement.dataset.motion = reduced ? "reduced" : "full";
    try { localStorage.setItem("portfolio-motion", paused ? "paused" : "full"); }
    catch { /* Controls still work when storage is unavailable. */ }
  }, [reduced, paused]);
  return (
    <MotionContext.Provider value={{ reduced, paused, systemReduced, toggle: () => setPaused(v => !v) }}>
      <MotionConfig reducedMotion={reduced ? "always" : "never"}>{children}</MotionConfig>
    </MotionContext.Provider>
  );
}

export const useMotionPreferences = () => useContext(MotionContext);
