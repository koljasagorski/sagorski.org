import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
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
  "Strukturierte Penetrationstests für mittelständische Unternehmen. Nachweisbar nach BSI, dokumentiert für NIS2, mit klarem Behebungspfad. Aus Gelsenkirchen, für DACH.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title:
    "Kolja Sagorski — Penetration Testing & IT-Sicherheit für den Mittelstand",
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
  themeColor: "#fdfdfb",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
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
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    email: site.email,
    availableLanguage: ["de", "en"],
  },
};

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
        <Header />
        {children}
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
