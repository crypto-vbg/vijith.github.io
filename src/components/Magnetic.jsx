import { useRef } from "react";
import { animate, createSpring } from "animejs";

/**
 * Magnetic hover — the wrapped element leans toward the cursor while inside its
 * hit area, then springs back on exit. anime.js supplies the spring so the
 * release overshoots slightly instead of snapping flat. Disabled on phones /
 * reduced-motion, where it renders as a plain passthrough.
 */
export default function Magnetic({ children, strength = 0.4, disabled = false }) {
  const ref = useRef(null);
  const running = useRef(null);

  if (disabled) return children;

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    running.current?.pause();
    const r = el.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * strength;
    const y = (e.clientY - (r.top + r.height / 2)) * strength;
    el.style.transform = `translate(${x}px, ${y}px)`;
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    running.current = animate(el, {
      translateX: 0,
      translateY: 0,
      ease: createSpring({ stiffness: 180, damping: 12 }),
    });
  };

  return (
    <span
      ref={ref}
      className="magnetic"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
    </span>
  );
}
