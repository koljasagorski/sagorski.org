import type { ReactNode } from "react";
import { Eyebrow } from "./Eyebrow";

export function SectionGrid({
  id,
  eyebrow,
  children,
}: {
  id: string;
  eyebrow: string;
  children: ReactNode;
}) {
  const labelId = `${id}-label`;

  return (
    <section id={id} aria-labelledby={labelId} className="section">
      <div className="container section-inner">
        <div className="section-grid">
          <div className="section-aside">
            <Eyebrow as="h2" id={labelId}>
              {eyebrow}
            </Eyebrow>
          </div>
          <div className="section-main">{children}</div>
        </div>
      </div>
    </section>
  );
}
