export default function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <span>© {new Date().getFullYear()} Vijith BG · Bengaluru, India</span>
        <span className="mono">designed & built with react, framer-motion & a lot of AI ✦</span>
      </div>
    </footer>
  );
}
