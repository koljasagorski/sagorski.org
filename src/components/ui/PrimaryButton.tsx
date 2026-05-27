import type { ReactNode } from "react";

export function PrimaryButton({
  href,
  children,
  className = "btn-primary",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}
