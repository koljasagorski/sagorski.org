import type { Metadata } from "next";
import { LabScene } from "@/components/lab/LabScene";
import "./lab.css";

export const metadata: Metadata = {
  title: "Lab · Threat Globe — Kolja Sagorski",
  description:
    "Eine visuelle Annäherung an die Angriffslage, der mittelständische Unternehmen ausgesetzt sind — und an die strukturierte Antwort darauf.",
  robots: { index: false, follow: true },
  alternates: { canonical: "https://sagorski.it/lab" },
};

export default function LabPage() {
  return <LabScene />;
}
