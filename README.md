# sagorski.it

Persönliche Website von Kolja Sagorski (Penetration Testing & IT-Security). Deployment auf Cloudflare Pages.

## Quickstart mit Claude Code

```bash
# Repo klonen
git clone <repo-url> sagorski-it
cd sagorski-it

# Claude Code starten und Build-Spec lesen lassen
claude

# In Claude Code:
# > Lies CLAUDE.md komplett und setze das Projekt entsprechend auf.
```

Claude Code arbeitet die Build-Spec in `CLAUDE.md` Schritt für Schritt ab. Die Spec enthält Design-System, Inhalte (final, nicht ändern), Komponentenstruktur und Cloudflare-Pages-Konfiguration.

## Manuell entwickeln

```bash
npm install
npm run dev          # http://localhost:3000
```

## Cloudflare Pages deployen

```bash
npm run preview      # lokaler Cloudflare-Build-Test
npm run deploy       # Live-Deploy via Wrangler
```

Alternativ: Repo mit Cloudflare Pages verbinden, dann läuft der Build automatisch bei jedem Push.

## Struktur

- `CLAUDE.md` — die maßgebliche Build-Spec
- `src/app/` — Next.js App Router
- `src/components/` — UI-Komponenten

## Hinweise

Die finalen Texte und das Design sind in `CLAUDE.md` festgelegt. Änderungen am Inhalt bitte zuerst dort dokumentieren, dann den Code anpassen — nicht umgekehrt.

## Build & Verifikation

In der Entwicklungsumgebung geprüft:

- `npm run build` — Next.js-Production-Build erfolgreich, Seite vollständig statisch (`force-static`).
- `npm run pages:build` — Cloudflare-Adapter (`@cloudflare/next-on-pages`) erzeugt deploybaren Output in `.vercel/output/static`.
- Server-gerendertes HTML kontrolliert: Title, Meta-Description, Canonical, OG-Tags, JSON-LD (`Person`), Favicons/Manifest, alle Anchor-Sektionen sowie mailto- und Impressum-Links.
- Visuelle Prüfung bei 1280 px (Desktop) und 390 px (Mobile): Serif-Headlines, Coral-Akzent, 200px/1fr-Grid, auf Mobile wandern die Eyebrows über den Content.

Lighthouse noch gegen die deployte Cloudflare-Preview ausführen (Ziele: Performance ≥ 95, Accessibility ≥ 95, Best Practices 100, SEO 100) und das Ergebnis hier ergänzen.

### Toolchain-Hinweis

`@cloudflare/next-on-pages` unterstützt derzeit Next.js bis `15.5.2` (Peer-Range), deshalb ist Next exakt auf diese Version gepinnt. Cloudflare empfiehlt inzwischen `@opennextjs/cloudflare` als Nachfolge-Adapter; ein späterer Wechsel erlaubt neuere Next-Versionen.
