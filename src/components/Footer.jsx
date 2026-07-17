import { SITE } from "../site.config.js";

export default function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <span>{SITE.footer.left.replace("{year}", new Date().getFullYear())}</span>
        <span className="mono">{SITE.footer.right}</span>
      </div>
    </footer>
  );
}
