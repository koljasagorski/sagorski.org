# sagorski.it — Build Spec

Du baust die persönliche Website von **Kolja Sagorski** — Penetration Tester & IT-Security-Berater aus Gelsenkirchen. Die Seite ersetzt die bisherige Carrd-Version unter `sagorski.it` und wird auf **Cloudflare Pages** gehostet.

## Zielperson

CEO, CTO oder CISO eines mittelständischen Unternehmens (100–500 Mitarbeitende), der prüft, ob er Kolja für einen Penetrationstest beauftragt. Der Entscheider ist haftungs-getrieben (NIS2 seit Oktober 2024) und muss eine fünfstellige Investition rechtfertigen. Er sucht nicht nach Hacker-Coolness, sondern nach: Vertrauen, Methodik, Nachweisbarkeit, klarem Behebungspfad.

**Ton:** seriös, direkt, ohne Buzzwords. Risiko-Framing über Konsequenzen (Haftung, Versicherung, Audit). Keine FUD-Übertreibung — der Leser ist intelligent und merkt das sofort.

## Tech-Stack

- **Next.js 15** (App Router, TypeScript, RSC)
- **Tailwind CSS v4** für Styling
- **Cloudflare Pages** als Deployment-Target
  - Adapter: `@cloudflare/next-on-pages`
  - Build-Command: `npx @cloudflare/next-on-pages@1`
  - Output-Directory: `.vercel/output/static`
  - Node-Compatibility: aktiviert
- **Schriften** via `next/font/google`:
  - Sans: `Inter` (variable, weight 400 und 500)
  - Serif: `Instrument Serif` für Headlines (regular + italic)
- **Icons:** `lucide-react` (Outline-Style, passend zum Look)
- **Keine** zusätzlichen UI-Libraries (kein shadcn, kein Radix). Alles selbst gebaut, da bewusst reduziert.

## Design-System

### Farben

```css
--bg:           #fdfdfb;  /* Haupt-Hintergrund, warmes Off-White */
--surface:      #ffffff;  /* Karten/Abschnitte mit leichtem Kontrast */
--surface-alt:  #f4f4f1;  /* Sekundär-Flächen, Trust-Strip */
--text:         #0a0a0a;  /* Headlines, primärer Text */
--text-body:    #2a2a2a;  /* Fließtext */
--text-muted:   #4a4a4a;  /* Erklärungstext */
--text-subtle:  #6a6a6a;  /* Untertitel, Captions */
--text-faint:   #888888;  /* Eyebrows, Labels */
--border:       #ececea;  /* Dezente Trenner */
--border-strong: #e6e6e2; /* Sektion-Übergänge */

--accent:       #b8472d;  /* Coral/Terracotta — Akzent für Headlines, Zahlen */
--success:      #1d9e75;  /* Vertrauens-Signal (Shield, Häkchen) */
--warning-bg:   #fef2f2;  /* NIS2-Warnbanner Hintergrund */
--warning-text: #991b1b;  /* NIS2-Warnbanner Text */
--warning-border: #fecaca;

--dark-bg:      #0a0a0a;  /* CTA-Strip & Footer */
--dark-text:    #ffffff;
--dark-muted:   #999999;
```

### Typografie

| Element       | Font     | Größe Desktop | Gewicht | Tracking   | Leading |
| ------------- | -------- | ------------- | ------- | ---------- | ------- |
| H1 Hero       | Serif    | 48 px         | 400     | -0.018em   | 1.1     |
| H2 Section    | Serif    | 22 px         | 400     | -0.01em    | 1.3     |
| Frage (Block) | Serif    | 19 px         | 400     | normal     | 1.4     |
| Body Lead     | Sans     | 17 px         | 400     | normal     | 1.65    |
| Body          | Sans     | 15 px         | 400     | normal     | 1.7     |
| Eyebrow       | Sans     | 11 px         | 500     | 0.2em      | 1       |
| Caption/Hint  | Sans     | 13 px         | 400     | normal     | 1.55    |

- **Sentence case** überall — nie Title Case, nie ALL CAPS (außer kleinen Eyebrows mit Tracking).
- **Keine fetten Headlines.** Serif in 400 ist die ganze Schwere, die wir brauchen.
- Akzentwörter in der H1 (`ob`, `wann`) sind `<em>` mit `font-style: italic`, `ob` zusätzlich in `var(--accent)`.

### Layout

- Container: `max-width: 1080px`, zentriert, horizontales Padding `1.5rem` mobil, `2.75rem` ab `md`.
- Sektionen: zweispaltiges Grid `[200px] 1fr` mit `gap: 2rem` ab `md`. Links das Eyebrow-Label (`TÄTIGKEITSFELDER`, `WAS SIE ERHALTEN`, …), rechts der Inhalt.
- Sektion-Trenner: `0.5px solid var(--border)` als horizontale Linien, kein vertikales Padding-Trick.
- Auf mobile: Spalten kollabieren zu Single-Column, Eyebrow steht über dem Content.

### Komponenten-Vokabular

- **Eyebrow** — kleines Label oben in jeder Sektion. Uppercase, tracking 0.2em, Farbe `text-faint`.
- **Warning-Banner** — pill-förmig (`border-radius: 3px`), helles Rot, mit `lucide-react` `AlertTriangle`-Icon, oben im Hero.
- **CTA-Primär** — schwarzer Button (`bg: #0a0a0a`, weißer Text), 13px Padding vertikal, 22px horizontal, `border-radius: 3px`, klein und seriös. **Nicht** rounded-full, nicht groß und auffällig.
- **CTA-Sekundär** — Link mit Unterlinie, gleicher Stil wie Body, kein Button.
- **Bullet-Item** — Icon links (`width: 32px`, `lucide-react` outline), Titel + Beschreibung rechts. Trennlinien `0.5px solid var(--border)` zwischen Items.

## Inhalt der Seite

Die Seite ist ein One-Pager mit folgenden Sektionen in dieser Reihenfolge:

### 1. Header (Sticky)

- Links: `Kolja Sagorski` (500, 13px) + `— Offensive Security` (400, muted)
- Rechts: Navigation `Risikoperspektive`, `Vorgehen`, `Vita`, `Kontakt` — Anchor-Links zu den Sektionen unten
- Hintergrund: `var(--bg)` mit dezenter Bottom-Border, beim Scrollen unscharfer Hintergrund (`backdrop-filter: blur(8px)` + halbtransparent)

### 2. Hero

- **Warning-Banner** oben: `⚠ NIS2 in Kraft seit Oktober 2024 — Geschäftsleitung haftet persönlich`
- **H1:**
  > Die Frage ist nicht *ob*, sondern *wann* — und ob Sie es vor dem Angreifer wissen.

  „ob" als italic + accent-farben, „wann" nur italic.
- **Lead:**
  > Ich führe strukturierte Penetrationstests für mittelständische Unternehmen durch. Ergebnis: Sie wissen, wo Sie verwundbar sind — bevor es Ihre Auditoren, Ihre Cyber-Versicherung oder ein Angreifer herausfindet.
- **CTA:** Primärbutton `Risiko-Gespräch vereinbaren →` (mailto:kontakt@sagorski.it), daneben Caption `30 min · vertraulich · ohne Verpflichtung`

Padding: `72px 0 56px` (vertikal generös)

### 3. Drei Fragen (`#risikoperspektive`)

Eyebrow: `DREI FRAGEN`

Drei aufeinanderfolgende Blöcke mit jeweils:
- Serif-Frage (19px, line-height 1.4)
- Subtle Caption darunter (13px, muted)
- Abstand zwischen Blöcken: `1.6rem`

Inhalt:

1. **Wann wurde Ihre externe Angriffsfläche zuletzt manuell getestet?**
   *Automatische Scans erkennen Bekanntes. Echte Angreifer suchen das Unbekannte.*

2. **Wüssten Sie es, wenn ein Angreifer bereits im Netz wäre?**
   *Mittlere Verweildauer eines Angreifers bis zur Entdeckung: mehrere Monate.*

3. **Wie erklären Sie nach einem Vorfall der Geschäftsleitung, was getan wurde?**
   *NIS2 verlangt nachweisbare Maßnahmen. Ein dokumentierter Pentest ist einer davon.*

### 4. Was Sie erhalten (`#vorgehen`)

Eyebrow: `WAS SIE ERHALTEN`

Vier Bullet-Items (Icon + Titel + Beschreibung), mit `0.5px` Trennlinien dazwischen:

| Icon (lucide) | Titel | Beschreibung |
|---|---|---|
| `ShieldCheck` (success-Farbe) | Nachweis für Auditor & Versicherer | Dokumentation nach BSI-Modell, geeignet als Nachweis gegenüber Cyber-Versicherung und im Rahmen von NIS2-Auditierungen. |
| `Target` (accent-Farbe) | Priorisierte Risiko-Liste | Nicht „300 Schwachstellen", sondern: Diese drei kosten Sie das Unternehmen. Diese fünf den Audit. |
| `PresentationChart` (subtle) | Bericht für die Leitungsebene | Management Summary in Geschäftssprache. Vorlegbar für Geschäftsführung, Vorstand, Beirat. |
| `Route` (subtle) | Klarer Behebungspfad | Jede Empfehlung mit Aufwand und Wirkung. Re-Test nach Behebung ist im Festpreis enthalten. |

Icons in Größe 22px, Outline-Style.

### 5. Wer ich bin (`#vita`)

Eyebrow: `WER ICH BIN`

Zwei Absätze, max-width 560px:

> Über zwanzig Jahre IT, davon Jahre in Verantwortung als IT-Leiter mittelständischer Unternehmen — ich kenne beide Seiten des Tisches. SAL1-zertifiziert, kontinuierlich aktiv in der Hands-on-Praxis (TryHackMe Top-Rang, fortlaufende Mandate).
>
> Sie sprechen mit dem, der testet und schreibt. Kein Sales-Layer, kein White-Label, keine Junior-Consultants.

Erster Absatz: 15px, `text-body`, line-height 1.75.
Zweiter Absatz: 14px, `text-subtle`, line-height 1.7.

### 6. CTA-Strip (`#kontakt`)

Dunkler Block (`var(--dark-bg)`, weißer Text), padding 36px 44px.

Dreispaltig (auf mobile gestapelt):
- Links: Eyebrow `NÄCHSTER SCHRITT` (muted-grau)
- Mitte: Serif 22px `30 Minuten. Vertraulich. Klarheit.` + Caption `Wir besprechen Ihre Lage. Sie entscheiden danach in Ruhe.`
- Rechts: Weißer Button mit schwarzem Text `Gespräch anfragen` (mailto:kontakt@sagorski.it)

### 7. Footer

Hintergrund: `var(--dark-bg)`, Text: `var(--dark-muted)`, 12px.

- Links: `© 2026 Kolja Sagorski · Gelsenkirchen · SAL1 zertifiziert`
- Rechts: Link `Impressum & Datenschutz` → `https://impressum.sagorski.it`
- Zusätzliche Zeile mit Social-Links unauffällig: LinkedIn (`https://www.linkedin.com/in/koljasagorski/`), TryHackMe (`https://tryhackme.com/p/KoljaSagorski`)

## Verhalten & Interaktion

- **Smooth Scroll** für alle Anchor-Links.
- **Keine Animationen** beim Page-Load. Keine Fade-Ins, keine Stagger-Effekte. Die Seriosität entsteht durch Stille.
- **Hover-States:** Nur Links unterstreichen sich beim Hover (sonst `text-decoration: none`). Buttons werden minimal heller (`opacity: 0.9`). Keine Transform-Effekte.
- **Focus-States:** Klar sichtbar für Tastatur-Navigation — 2px solid `var(--accent)` mit 2px Offset.

## SEO & Meta

- `<title>`: `Kolja Sagorski — Penetration Testing & IT-Sicherheit für den Mittelstand`
- Meta-Description: `Strukturierte Penetrationstests für mittelständische Unternehmen. Nachweisbar nach BSI, dokumentiert für NIS2, mit klarem Behebungspfad. Aus Gelsenkirchen, für DACH.`
- OG-Tags: gleiche Description, Title `Kolja Sagorski — Offensive Security`
- OG-Image: `/og.jpg` (Platzhalter — Kolja liefert nach), 1200×630
- Favicon: `/favicon.ico` (Platzhalter)
- `lang="de"` auf `<html>`
- `<meta name="theme-color" content="#fdfdfb">`
- Canonical: `https://sagorski.it/`
- Strukturierte Daten (JSON-LD) als `Person` mit Beruf, Ort, contactPoint — am Ende von `<head>`.

## Performance

- Statisches Rendering (`export const dynamic = "force-static"`)
- Keine Client-Components nötig (alles Server-Side renderbar)
- `next/font` mit `display: swap` und Subset `latin`
- Preconnect zu `fonts.gstatic.com` automatisch durch `next/font`
- Lighthouse-Ziele: Performance ≥95, Accessibility ≥95, Best Practices 100, SEO 100

## Accessibility

- Semantisches HTML: `<main>`, `<header>`, `<nav>`, `<section>` mit `aria-labelledby`, `<footer>`
- Jede Sektion bekommt eine sichtbare Überschrift (visuell als Eyebrow gestaltet, aber als `<h2>` im DOM)
- Kontrast: alle Text-Farben gegen Hintergründe ≥ 7:1 (AAA) prüfen
- Reduzierte Motion respektieren: `@media (prefers-reduced-motion: reduce)` — alle Übergänge aus
- Skip-Link `Zum Hauptinhalt springen` für Tastatur-Nutzer

## Dateistruktur

```
.
├── CLAUDE.md                 (diese Datei)
├── README.md                 (kurz: was das ist, wie deployen)
├── package.json
├── tsconfig.json
├── next.config.mjs
├── tailwind.config.ts
├── postcss.config.mjs
├── .gitignore
├── public/
│   ├── favicon.ico
│   ├── og.jpg
│   └── robots.txt
└── src/
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx
    │   ├── globals.css
    │   └── opengraph-image.tsx        (optional, dynamisch generiert)
    └── components/
        ├── Header.tsx
        ├── Hero.tsx
        ├── DreiFragen.tsx
        ├── WasSieErhalten.tsx
        ├── WerIchBin.tsx
        ├── CtaStrip.tsx
        ├── Footer.tsx
        └── ui/
            ├── Eyebrow.tsx
            ├── SectionGrid.tsx        (das 200px / 1fr Layout)
            └── PrimaryButton.tsx
```

## Cloudflare Pages Setup

**`next.config.mjs`:**
```js
import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev'

if (process.env.NODE_ENV === 'development') {
  await setupDevPlatform()
}

export default {
  reactStrictMode: true,
}
```

**`package.json` scripts (relevant):**
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "pages:build": "npx @cloudflare/next-on-pages",
    "preview": "npm run pages:build && wrangler pages dev",
    "deploy": "npm run pages:build && wrangler pages deploy"
  }
}
```

**`wrangler.toml`:**
```toml
name = "sagorski-it"
compatibility_date = "2025-01-01"
compatibility_flags = ["nodejs_compat"]
pages_build_output_dir = ".vercel/output/static"
```

**Cloudflare Pages Dashboard:**
- Framework preset: `Next.js`
- Build command: `npx @cloudflare/next-on-pages@1`
- Build output directory: `.vercel/output/static`
- Environment variables: `NODE_VERSION=20`

## Was du NICHT tun sollst

- Keine Animations-Libraries (Framer Motion etc.) — die Seite soll ruhig sein.
- Keine Pop-ups, Cookie-Banner, Live-Chats. Es gibt keine Tracker.
- Keine Lorem-Ipsum-Texte. Nutze ausschließlich die Texte aus dieser Spec.
- Keine Buzzwords wie „cutting-edge", „innovative", „leading", „state-of-the-art".
- Keine Stockfotos. Wenn überhaupt Bild, dann später ein professionelles Portrait von Kolja (Platzhalter `/portrait.jpg`).
- Keine Pricing-Anzeige. Preise werden im Gespräch besprochen.
- Keine Newsletter-Anmeldung, kein „Free Resource Download".
- Keine Testimonials erfinden. Bleibt leer, bis Kolja echte hat.
- Keine Lottie-Animationen, keine Hero-Videos, keine Particle-Backgrounds.

## Reihenfolge der Umsetzung

1. Projekt aufsetzen: `npx create-next-app@latest sagorski-it --typescript --tailwind --app --src-dir --import-alias "@/*"`
2. `next/font`-Setup für Inter + Instrument Serif in `layout.tsx`
3. Globale Styles in `globals.css` (CSS-Variablen aus dem Design-System)
4. Tailwind-Theme in `tailwind.config.ts` erweitern (Farben, Schriften)
5. UI-Atome bauen (`Eyebrow`, `SectionGrid`, `PrimaryButton`)
6. Sektionen einzeln bauen, in dieser Reihenfolge: `Header` → `Hero` → `DreiFragen` → `WasSieErhalten` → `WerIchBin` → `CtaStrip` → `Footer`
7. Alles in `page.tsx` zusammensetzen
8. Meta-Tags & JSON-LD in `layout.tsx`
9. Cloudflare-Adapter installieren: `npm i -D @cloudflare/next-on-pages wrangler`
10. Lokal testen mit `npm run dev`, dann `npm run preview` für Cloudflare-Build
11. Lighthouse-Audit, ggf. nachschärfen

## Kontakt-Daten (für Footer/Meta)

- **Name:** Kolja Sagorski
- **Standort:** Gelsenkirchen, Nordrhein-Westfalen, Deutschland
- **E-Mail:** kontakt@sagorski.it
- **Website:** https://sagorski.it
- **Impressum:** https://impressum.sagorski.it
- **LinkedIn:** https://www.linkedin.com/in/koljasagorski/
- **TryHackMe:** https://tryhackme.com/p/KoljaSagorski

## Endprüfung vor Deploy

- [ ] Alle Texte aus der Spec exakt übernommen, keine Umformulierungen
- [ ] Kein Tracking-Code (kein GA, kein Plausible-Snippet, nichts)
- [ ] Impressum-Link funktioniert
- [ ] Mailto-Link öffnet korrekt
- [ ] Mobile-Layout sauber (Eyebrows wandern über Content)
- [ ] Lighthouse-Run dokumentiert in `README.md`
- [ ] `npm run preview` läuft sauber durch
- [ ] `wrangler pages deploy` produziert deploybaren Output

## Linear

Linear-Projekt: **sagorski.it (Personal Site)** — https://linear.app/sagorski/project/sagorskiit-personal-site-a077b0b1b058

Zu Session-Beginn die offenen Issues dieses Projekts in Linear lesen (Tool `list_issues`, project = obige URL/ID).
Substanzielle Arbeit als Linear-Issue anlegen bzw. ein bestehendes aktualisieren; bei Abschluss das Issue schliessen.
Team: Kolja Sagorski (KOL).
