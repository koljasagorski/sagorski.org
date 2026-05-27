import { site } from "@/lib/site";

const navItems = [
  { href: "#risikoperspektive", label: "Risikoperspektive" },
  { href: "#vorgehen", label: "Vorgehen" },
  { href: "#vita", label: "Vita" },
  { href: "#kontakt", label: "Kontakt" },
];

export function Header() {
  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <a href="#" className="brand" aria-label={`${site.name} — ${site.role}`}>
          <span className="brand-name">{site.name}</span>{" "}
          <span className="brand-role">— {site.role}</span>
        </a>
        <nav className="site-nav" aria-label="Hauptnavigation">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
