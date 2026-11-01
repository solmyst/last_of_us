import type { ReactNode } from "react";

export default function SectionHeading({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="section-title">{title}</h2>
      </div>
      {children && (
        <p className="max-w-sm text-text-secondary leading-relaxed">
          {children}
        </p>
      )}
    </div>
  );
}
