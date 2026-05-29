import type { Metadata } from "next";
import { LabExperience } from "@/components/lab/LabExperience";
import "./lab.css";

// The lab experience is now the homepage at "/". This route stays as a
// backwards-compatible alias for anyone who bookmarked /lab.
export const metadata: Metadata = {
  title: "Penetrationstests für den Mittelstand — Kolja Sagorski",
  description:
    "Eine scrollbare Geschichte über die Angriffslage, der mittelständische Unternehmen ausgesetzt sind — und über die strukturierte Antwort darauf.",
  robots: { index: false, follow: true },
  alternates: { canonical: "https://sagorski.it/" },
};

export const dynamic = "force-static";

export default function LabPage() {
  return (
    <main id="main">
      <LabExperience />
    </main>
  );
}
