import { Menu } from "lucide-react";

import { LogoutButton } from "@/components/layout/logout-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { SessionUser } from "@/lib/types";

export function AppHeader({ user }: { user: SessionUser }) {
  return (
    <header className="no-print flex items-center justify-between rounded-3xl border bg-card p-4 shadow-soft">
      <div className="space-y-1">
        <p className="text-sm font-semibold text-muted-foreground">Welcome back</p>
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-xl font-bold">{user.name}</h2>
          <Badge variant="outline">
            {user.role === "ADMIN" ? "Admin access" : "Street Representative"}
          </Badge>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button type="button" variant="ghost" size="icon" className="lg:hidden" aria-label="Navigation">
          <Menu className="h-5 w-5" />
        </Button>
        <LogoutButton />
      </div>
    </header>
  );
}
