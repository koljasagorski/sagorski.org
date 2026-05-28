import type { ElementType, ReactNode } from "react";

type EyebrowTag = ElementType<{
  id?: string;
  className?: string;
  children?: ReactNode;
}>;

export function Eyebrow({
  as = "p",
  id,
  className,
  children,
}: {
  as?: EyebrowTag;
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  const Tag = as;
  return (
    <Tag id={id} className={className ? `eyebrow ${className}` : "eyebrow"}>
      {children}
    </Tag>
  );
}
