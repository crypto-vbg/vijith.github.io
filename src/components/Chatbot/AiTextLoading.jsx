import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

/* Ported from kokonutui's "AI Text Loading": cycles status messages with a
   shimmering gradient sweep. Rebuilt on the already-installed framer-motion +
   plain CSS (see .cb-ail in chatbot.css) instead of Tailwind/shadcn. */
const DEFAULT_TEXTS = ["Thinking…", "Analyzing…", "Composing…", "Almost there…"];

export default function AiTextLoading({ texts = DEFAULT_TEXTS, interval = 1500 }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % texts.length), interval);
    return () => clearInterval(t);
  }, [interval, texts.length]);

  return (
    <span className="cb-ail" role="status" aria-live="polite">
      <AnimatePresence mode="wait">
        <motion.span
          key={i}
          className="cb-ail-text"
          initial={{ opacity: 0, y: 8 }}
          animate={{
            opacity: 1,
            y: 0,
            backgroundPosition: ["200% center", "-200% center"],
          }}
          exit={{ opacity: 0, y: -8 }}
          transition={{
            opacity: { duration: 0.3 },
            y: { duration: 0.3 },
            backgroundPosition: { duration: 2.5, ease: "linear", repeat: Infinity },
          }}
        >
          {texts[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
