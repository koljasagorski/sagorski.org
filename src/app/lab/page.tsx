import type { Metadata } from "next";
import { LabExperience } from "@/components/lab/LabExperience";
import "./lab.css";

export const metadata: Metadata = {
  title: "Lab · Cyber Security visualisiert — Kolja Sagorski",
  description:
    "Eine scrollbare Geschichte über die Angriffslage, der mittelständische Unternehmen ausgesetzt sind — und über die strukturierte Antwort darauf.",
  robots: { index: false, follow: true },
  alternates: { canonical: "https://sagorski.it/lab" },
};

export default function LabPage() {
  return <LabExperience />;
}
