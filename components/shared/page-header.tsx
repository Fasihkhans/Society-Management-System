import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  actions
}: {
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border bg-card p-6 shadow-soft md:flex-row md:items-center md:justify-between">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="max-w-3xl text-base text-muted-foreground">{description}</p>
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </div>
  );
}
