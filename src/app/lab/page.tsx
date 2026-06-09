import type { Metadata } from "next";
import { LabExperience } from "@/components/lab/LabExperience";
import "./lab.css";

// /lab is now an opt-in demo (the homepage at "/" is the terminal page).
export const metadata: Metadata = {
  title: "Lab · 3D-Globus zur Bedrohungslage — Kolja Sagorski",
  description:
    "Eine scrollbare 3D-Geschichte zur Angriffslage mittelständischer Unternehmen — und zur strukturierten Antwort darauf.",
  alternates: { canonical: "https://sagorski.it/lab" },
};

export const dynamic = "force-static";

export default function LabPage() {
  return (
    <main id="main">
      <LabExperience />
    </main>
  );
}
