import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer-inner">
        <div className="footer-row">
          <span>
            © 2026 {site.name} · {site.location} · SAL1 zertifiziert
          </span>
          <a href={site.impressum} className="link-underline">
            Impressum & Datenschutz
          </a>
        </div>
        <div className="footer-social">
          <a
            href={site.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline"
          >
            LinkedIn
          </a>
          <a
            href={site.tryhackme}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline"
          >
            TryHackMe
          </a>
        </div>
      </div>
    </footer>
  );
}
