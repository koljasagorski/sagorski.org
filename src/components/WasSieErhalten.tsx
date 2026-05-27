import { ShieldCheck, Target, Presentation, Route } from "lucide-react";
import { SectionGrid } from "./ui/SectionGrid";

const items = [
  {
    Icon: ShieldCheck,
    color: "var(--success)",
    title: "Nachweis für Auditor & Versicherer",
    desc: "Dokumentation nach BSI-Modell, geeignet als Nachweis gegenüber Cyber-Versicherung und im Rahmen von NIS2-Auditierungen.",
  },
  {
    Icon: Target,
    color: "var(--accent)",
    title: "Priorisierte Risiko-Liste",
    desc: "Nicht „300 Schwachstellen“, sondern: Diese drei kosten Sie das Unternehmen. Diese fünf den Audit.",
  },
  {
    Icon: Presentation,
    color: "var(--text-subtle)",
    title: "Bericht für die Leitungsebene",
    desc: "Management Summary in Geschäftssprache. Vorlegbar für Geschäftsführung, Vorstand, Beirat.",
  },
  {
    Icon: Route,
    color: "var(--text-subtle)",
    title: "Klarer Behebungspfad",
    desc: "Jede Empfehlung mit Aufwand und Wirkung. Re-Test nach Behebung ist im Festpreis enthalten.",
  },
];

export function WasSieErhalten() {
  return (
    <SectionGrid id="vorgehen" eyebrow="Was Sie erhalten">
      <ul className="bullet-list">
        {items.map(({ Icon, color, title, desc }) => (
          <li key={title} className="bullet-item">
            <span className="bullet-icon" style={{ color }}>
              <Icon size={22} strokeWidth={1.75} aria-hidden="true" />
            </span>
            <div>
              <h3 className="bullet-title">{title}</h3>
              <p className="bullet-desc">{desc}</p>
            </div>
          </li>
        ))}
      </ul>
    </SectionGrid>
  );
}
