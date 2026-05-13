import { Badge } from "@/components/ui/badge";
import type { DueStatus } from "@/lib/types";

export function StatusBadge({ status }: { status: DueStatus }) {
  if (status === "PAID") {
    return <Badge variant="success">Paid</Badge>;
  }

  if (status === "PARTIAL") {
    return <Badge variant="warning">Partial</Badge>;
  }

  return <Badge variant="destructive">Pending</Badge>;
}
