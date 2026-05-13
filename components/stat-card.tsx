import type { ReactNode } from "react";

type StatCardProps = {
  label: string;
  value: string;
  detail: string;
  accent?: "green" | "amber" | "red";
  icon?: ReactNode;
};

export function StatCard({ label, value, detail, accent = "green", icon }: StatCardProps) {
  return (
    <article className={`stat-card stat-card--${accent}`}>
      <div className="stat-card__top">
        <p>{label}</p>
        {icon ? <span className="stat-card__icon">{icon}</span> : null}
      </div>
      <strong>{value}</strong>
      <span>{detail}</span>
    </article>
  );
}
