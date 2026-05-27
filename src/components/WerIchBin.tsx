import { SectionGrid } from "./ui/SectionGrid";

export function WerIchBin() {
  return (
    <SectionGrid id="vita" eyebrow="Wer ich bin">
      <div className="vita-text">
        <p className="lead">
          Über zwanzig Jahre IT, davon Jahre in Verantwortung als IT-Leiter
          mittelständischer Unternehmen — ich kenne beide Seiten des Tisches.
          SAL1-zertifiziert, kontinuierlich aktiv in der Hands-on-Praxis
          (TryHackMe Top-Rang, fortlaufende Mandate).
        </p>
        <p className="muted">
          Sie sprechen mit dem, der testet und schreibt. Kein Sales-Layer, kein
          White-Label, keine Junior-Consultants.
        </p>
        <p className="vita-references">
          Referenzen nenne ich vertraulich im Erstgespräch.
        </p>
      </div>
    </SectionGrid>
  );
}
