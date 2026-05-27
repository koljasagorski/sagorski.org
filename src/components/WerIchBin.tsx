import { Eyebrow } from "./ui/Eyebrow";

export function WerIchBin() {
  return (
    <section id="vita" aria-labelledby="vita-label" className="section">
      <div className="container section-inner">
        <div className="section-grid">
          <div className="section-aside">
            <Eyebrow as="h2" id="vita-label">
              Wer ich bin
            </Eyebrow>
            <img
              className="portrait"
              src="/portrait.png"
              width={116}
              height={116}
              alt="Porträt von Kolja Sagorski, Penetration Tester aus Gelsenkirchen"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="section-main">
            <div className="vita-text">
              <p className="lead">
                Über zwanzig Jahre IT, davon Jahre in Verantwortung als IT-Leiter
                mittelständischer Unternehmen — ich kenne beide Seiten des
                Tisches. SAL1-zertifiziert, kontinuierlich aktiv in der
                Hands-on-Praxis (TryHackMe Top-Rang, fortlaufende Mandate).
              </p>
              <p className="muted">
                Sie sprechen mit dem, der testet und schreibt. Kein Sales-Layer,
                kein White-Label, keine Junior-Consultants.
              </p>
              <p className="vita-references">
                Referenzen nenne ich vertraulich im Erstgespräch.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
