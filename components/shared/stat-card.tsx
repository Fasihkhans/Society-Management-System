import type { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";

export function StatCard({
  label,
  value,
  helper,
  icon
}: {
  label: string;
  value: string;
  helper: string;
  icon?: ReactNode;
}) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between gap-4 p-6">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-muted-foreground">{label}</p>
          <p className="text-3xl font-bold">{value}</p>
          <p className="text-sm text-muted-foreground">{helper}</p>
        </div>
        {icon ? <div className="rounded-2xl bg-secondary p-3 text-primary">{icon}</div> : null}
      </CardContent>
    </Card>
  );
}
