import { Hero } from "@/components/Hero";
import { DreiFragen } from "@/components/DreiFragen";
import { WasSieErhalten } from "@/components/WasSieErhalten";
import { MusterBefund } from "@/components/MusterBefund";
import { WerIchBin } from "@/components/WerIchBin";
import { CtaStrip } from "@/components/CtaStrip";

export const dynamic = "force-static";

export default function Home() {
  return (
    <main id="main">
      <Hero />
      <DreiFragen />
      <WasSieErhalten />
      <MusterBefund />
      <WerIchBin />
      <CtaStrip />
    </main>
  );
}
