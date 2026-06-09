import type { Metadata } from "next";
import { TerminalPrompt } from "@/components/terminal/Terminal";
import {
  ASCII_BANNER,
  BOOT,
  SESSION,
  STATUS,
} from "@/components/terminal/data";
import { site } from "@/lib/site";
import "./terminal.css";

export const dynamic = "force-static";

const description =
  "Manuelle, dokumentierte Penetrationstests für den Mittelstand — BSI-Modell, " +
  "klarer Behebungspfad, Re-Test im Festpreis. Aus Gelsenkirchen für DACH.";

export const metadata: Metadata = {
  title: `${site.name} — Pentests für den Mittelstand`,
  description,
  alternates: { canonical: `${site.url}/` },
  openGraph: {
    type: "website",
    url: `${site.url}/`,
    title: `${site.name} — Offensive Security`,
    description,
  },
};

const PROMPT = "kolja@sagorski:~$";

export default function HomePage() {
  return (
    <main id="main" className="term">
      <article className="term-window" aria-label="Terminal-Session">
        <header className="term-titlebar">
          <span className="term-dots" aria-hidden>
            <i className="dot dot-close" />
            <i className="dot dot-min" />
            <i className="dot dot-max" />
          </span>
          <span className="term-title">kolja@sagorski:~ — zsh — 80×24</span>
          <span className="term-titlebar-meta" aria-hidden>SAL1 · DACH</span>
        </header>

        <nav className="term-tabs" aria-label="Navigation">
          <a className="term-tab is-active" href="/">~</a>
          <a className="term-tab" href="/lab">/lab</a>
          <a className="term-tab" href={`mailto:${site.email}`}>/kontakt</a>
          <a className="term-tab" href={site.impressum}>/impressum</a>
        </nav>

        <div className="term-body">
          {/* === ASCII banner (decorative; sr-only fallback below) === */}
          <pre className="term-banner" aria-hidden>
            {ASCII_BANNER.map((l, i) => <span key={i}>{l}{"\n"}</span>)}
            <span className="term-banner-sub">
              {site.name} — {site.role} · {site.location}
            </span>
          </pre>

          {/* Real h1 for SEO / a11y, visually hidden behind the banner */}
          <h1 className="sr-only">
            {site.name} — Penetrationstests für den Mittelstand
          </h1>

          {/* === Boot sequence === */}
          <pre className="term-pre term-block" aria-label="Boot-Sequenz">
            {BOOT.map((l, i) => <div key={i}>{l}</div>)}
          </pre>

          {/* === Canned session: static, server-rendered === */}
          {SESSION.map((b, i) => (
            <pre key={i} className="term-pre term-block">
              <div className="t-row t-row-in">
                <span className="t-prompt">{PROMPT}</span>{" "}
                <span className="t-cmd">{b.cmd}</span>
              </div>
              {b.out.map((line, j) => (
                <div key={j} className="t-row t-row-out">{line}</div>
              ))}
            </pre>
          ))}

          {/* === Interactive prompt === */}
          <TerminalPrompt />
        </div>

        <footer className="term-status" aria-label="Status">
          {STATUS.map((s, i) => (
            <span key={i} className={`status-seg ${i === 0 ? "status-seg-accent" : ""}`}>
              {s.label}
            </span>
          ))}
          <span className="status-seg" aria-hidden>
            <kbd>↑</kbd> history · <kbd>Tab</kbd> · <kbd>help</kbd>
          </span>
        </footer>
      </article>
    </main>
  );
}
