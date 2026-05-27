import { SectionGrid } from "./ui/SectionGrid";

function Redact({ width }: { width: string }) {
  return (
    <span
      className="redact"
      style={{ width }}
      role="img"
      aria-label="geschwärzt"
    />
  );
}

export function MusterBefund() {
  return (
    <SectionGrid id="beispiel" eyebrow="Beispiel-Befund">
      <div className="finding">
        <div className="finding-head">
          <span className="sev sev-hoch">Hoch</span>
          <span className="finding-tag">Muster · anonymisiert</span>
        </div>

        <h3 className="finding-title">Exponiertes Administrations-Interface</h3>

        <dl className="finding-rows">
          <div>
            <dt>Fund</dt>
            <dd className="mono">
              https://<Redact width="5.5em" />.kunde.de/admin
            </dd>
          </div>
          <div>
            <dt>Beschreibung</dt>
            <dd>
              Ohne IP-Beschränkung aus dem Internet erreichbar, unter dem
              Standardpfad, in veralteter Version (<Redact width="7em" />).
            </dd>
          </div>
          <div>
            <dt>Impact</dt>
            <dd>
              Potenzieller Vollzugriff auf <Redact width="3em" />{" "}
              Kundendatensätze.
            </dd>
          </div>
          <div>
            <dt>Empfehlung</dt>
            <dd>
              Zugriff auf VPN bzw. IP-Whitelist beschränken, Update auf ≥{" "}
              <Redact width="2.5em" />. Re-Test nach Behebung im Festpreis
              enthalten.
            </dd>
          </div>
        </dl>

        <p className="finding-note">
          Illustratives Muster — keine realen Kundendaten.
        </p>
      </div>
    </SectionGrid>
  );
}
