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
