import { mailto } from "@/lib/site";
import { Eyebrow } from "./ui/Eyebrow";

export function CtaStrip() {
  return (
    <section id="kontakt" aria-labelledby="kontakt-label" className="section">
      <div className="container cta-section">
        <div className="cta-strip">
          <Eyebrow as="h2" id="kontakt-label" className="cta-eyebrow">
            Nächster Schritt
          </Eyebrow>
          <div>
            <p className="cta-headline">30 Minuten. Vertraulich. Klarheit.</p>
            <p className="cta-note">
              Wir besprechen Ihre Lage. Sie entscheiden danach in Ruhe.
            </p>
          </div>
          <a href={mailto} className="btn-on-dark">
            Gespräch anfragen
          </a>
        </div>
      </div>
    </section>
  );
}
