import { useEffect, useRef } from "react";
import { animate, svg } from "animejs";

/* FAB monogram that morphs its "V" stroke into an "X" (close) with anime.js
   morphTo when the panel opens, and back when it closes. The two template
   paths carry the geometry morphTo samples; they render nothing (no paint). */
const V_PATH = "M14 18 L26 46 L32 32";
const X_PATH = "M18 18 L46 46 M46 18 L18 46";

export default function MorphFab({ open, size = 34 }) {
  const pathRef = useRef(null);
  const vRef = useRef(null);
  const xRef = useRef(null);
  const mounted = useRef(false);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    // Skip the morph on first paint — just land on the correct shape.
    if (!mounted.current) {
      mounted.current = true;
      path.setAttribute("d", open ? X_PATH : V_PATH);
      return;
    }
    animate(path, {
      d: svg.morphTo(open ? xRef.current : vRef.current),
      ease: "inOutCirc",
      duration: 480,
    });
  }, [open]);

  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true">
      <path
        ref={pathRef}
        d={V_PATH}
        fill="none"
        stroke="#1c120b"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* geometry-only templates for morphTo (invisible) */}
      <path ref={vRef} d={V_PATH} fill="none" stroke="none" />
      <path ref={xRef} d={X_PATH} fill="none" stroke="none" />
    </svg>
  );
}
