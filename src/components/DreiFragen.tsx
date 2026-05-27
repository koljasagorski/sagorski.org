import { SectionGrid } from "./ui/SectionGrid";

const fragen = [
  {
    frage:
      "Wann wurde Ihre externe Angriffsfläche zuletzt manuell getestet?",
    note: "Automatische Scans erkennen Bekanntes. Echte Angreifer suchen das Unbekannte.",
  },
  {
    frage: "Wüssten Sie es, wenn ein Angreifer bereits im Netz wäre?",
    note: "Mittlere Verweildauer eines Angreifers bis zur Entdeckung: mehrere Monate.",
  },
  {
    frage:
      "Wie erklären Sie nach einem Vorfall der Geschäftsleitung, was getan wurde?",
    note: "NIS2 verlangt nachweisbare Maßnahmen. Ein dokumentierter Pentest ist einer davon.",
  },
];

export function DreiFragen() {
  return (
    <SectionGrid id="risikoperspektive" eyebrow="Drei Fragen">
      <div className="fragen-list">
        {fragen.map((item) => (
          <div key={item.frage}>
            <p className="frage">{item.frage}</p>
            <p className="frage-note">{item.note}</p>
          </div>
        ))}
      </div>
    </SectionGrid>
  );
}
