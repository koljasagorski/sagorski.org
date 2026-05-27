import type { ElementType, ReactNode } from "react";

export function Eyebrow({
  as: Tag = "p",
  id,
  className,
  children,
}: {
  as?: ElementType;
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag id={id} className={className ? `eyebrow ${className}` : "eyebrow"}>
      {children}
    </Tag>
  );
}
