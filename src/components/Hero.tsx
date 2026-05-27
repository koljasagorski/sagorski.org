import { AlertTriangle } from "lucide-react";
import { mailto } from "@/lib/site";
import { PrimaryButton } from "./ui/PrimaryButton";

export function Hero() {
  return (
    <section className="section" aria-labelledby="hero-title">
      <div className="container hero-inner">
        <p className="warning-banner">
          <AlertTriangle size={15} strokeWidth={2} aria-hidden="true" />
          <span>
            NIS2 in Kraft seit Oktober 2024 — Geschäftsleitung haftet
            persönlich
          </span>
        </p>

        <h1 id="hero-title" className="hero-title">
          Die Frage ist nicht <em className="accent">ob</em>, sondern{" "}
          <em>wann</em> — und ob Sie es vor dem Angreifer wissen.
        </h1>

        <p className="hero-lead">
          Ich führe strukturierte Penetrationstests für mittelständische
          Unternehmen durch. Ergebnis: Sie wissen, wo Sie verwundbar sind —
          bevor es Ihre Auditoren, Ihre Cyber-Versicherung oder ein Angreifer
          herausfindet.
        </p>

        <div className="hero-cta">
          <PrimaryButton href={mailto}>
            Risiko-Gespräch vereinbaren →
          </PrimaryButton>
          <span className="hero-cta-note">
            30 min · vertraulich · ohne Verpflichtung
          </span>
        </div>
      </div>
    </section>
  );
}
