import { motion } from "framer-motion";
import { useMotionPreferences } from "./MotionPreferences.jsx";

/** Scroll-into-view reveal wrapper used across sections. */
export default function Reveal({ children, delay = 0, y = 30, ...rest }) {
  const { reduced } = useMotionPreferences();
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: reduced ? 0 : 0.55, delay: reduced ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
