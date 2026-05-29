import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-inter",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-instrument",
});

const description =
  "Unabhängige Penetrationstests für den Mittelstand: nachweisbar nach BSI, dokumentiert für NIS2, mit priorisiertem Behebungspfad. Aus Gelsenkirchen für DACH.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: "Penetrationstests für den Mittelstand — Kolja Sagorski",
  description,
  alternates: {
    canonical: `${site.url}/`,
  },
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: `${site.url}/`,
    siteName: site.name,
    title: "Kolja Sagorski — Offensive Security",
    description,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Kolja Sagorski — Offensive Security",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kolja Sagorski — Offensive Security",
    description,
    images: ["/og.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", type: "image/png", sizes: "96x96" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#05080c",
};

const personId = `${site.url}/#person`;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": personId,
      name: site.name,
      jobTitle: "Penetration Tester & IT-Security-Berater",
      url: site.url,
      email: `mailto:${site.email}`,
      address: {
        "@type": "PostalAddress",
        addressLocality: site.location,
        addressRegion: site.region,
        addressCountry: site.country,
      },
      sameAs: [site.linkedin, site.tryhackme],
      knowsAbout: [
        "Penetrationstests",
        "Offensive Security",
        "IT-Sicherheit",
        "NIS2",
        "BSI IT-Grundschutz",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "sales",
        email: site.email,
        availableLanguage: ["de", "en"],
      },
    },
    {
      "@type": "ProfessionalService",
      "@id": `${site.url}/#service`,
      name: "Penetrationstests & IT-Sicherheitsberatung",
      url: site.url,
      provider: { "@id": personId },
      areaServed: ["DE", "AT", "CH"],
      serviceType: "Penetration Testing",
      description,
    },
  ],
};

// Easter eggs for the curious (devtools / source divers). Invisible to normal visitors.
const eggScript = `(function(){try{
var b="color:#b8472d;font:600 13px ui-sans-serif,system-ui";
var m="color:#6a6a6a;font:12px ui-sans-serif,system-ui";
var f="color:#999;font:11px ui-monospace,monospace";
console.log("%cNeugier ist die erste Phase. Schön, dass Sie hier sind.",b);
console.log("%cSchwachstelle gefunden — hier oder anderswo? Sagen Sie es mir, bevor es ein anderer tut.\\nResponsible Disclosure → kolja@sagorski.org · /.well-known/security.txt",m);
console.log("%c↑ ↑ ↓ ↓ ← → ← → B A",f);
var s=["arrowup","arrowup","arrowdown","arrowdown","arrowleft","arrowright","arrowleft","arrowright","b","a"],i=0;
addEventListener("keydown",function(e){i=((e.key||"").toLowerCase()===s[i])?i+1:0;if(i===s.length){i=0;
console.log("%cFLAG{neugier_ist_die_erste_phase_eines_angriffs}","color:#1d9e75;font:700 15px ui-monospace,monospace");
console.log("%cGut gemacht. Genau diese Hartnäckigkeit suche ich bei einem Pentest. → kolja@sagorski.org",m);}});
}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className={`${inter.variable} ${instrumentSerif.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Zum Hauptinhalt springen
        </a>
        {children}
        <link rel="author" href="/humans.txt" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script dangerouslySetInnerHTML={{ __html: eggScript }} />
      </body>
    </html>
  );
}
