import type { ReactNode } from "react";

type SectionCardProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function SectionCard({
  eyebrow,
  title,
  description,
  children,
  className
}: SectionCardProps) {
  return (
    <section className={className ? `panel ${className}` : "panel"}>
      <div className="section-head">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2>{title}</h2>
        {description ? <p className="section-copy">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}
