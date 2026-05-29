import { LabExperience } from "@/components/lab/LabExperience";
import "./lab/lab.css";

export const dynamic = "force-static";

export default function HomePage() {
  return (
    <main id="main">
      <LabExperience />
    </main>
  );
}
