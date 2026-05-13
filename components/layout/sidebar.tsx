"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, House, Landmark, Receipt, Settings, ShieldCheck, Users, Wallet } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { SessionUser } from "@/lib/types";

const navConfig = {
  ADMIN: [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/streets", label: "Streets", icon: Landmark },
    { href: "/houses", label: "Houses", icon: House },
    { href: "/residents", label: "Residents", icon: Users },
    { href: "/fee-cycles", label: "Monthly Fees", icon: Wallet },
    { href: "/collections", label: "Fee Collection", icon: Receipt },
    { href: "/pending-dues", label: "Pending Dues", icon: ShieldCheck },
    { href: "/reports/recovery", label: "Recovery Reports", icon: Home },
    { href: "/reports/ledger", label: "House Ledger", icon: Home },
    { href: "/users", label: "User Management", icon: Users },
    { href: "/imports/csv", label: "CSV Import", icon: Receipt },
    { href: "/settings", label: "Settings", icon: Settings }
  ],
  STREET_REP: [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/houses", label: "Assigned Houses", icon: House },
    { href: "/residents", label: "Residents", icon: Users },
    { href: "/collections", label: "Fee Collection", icon: Receipt },
    { href: "/pending-dues", label: "Pending Dues", icon: Wallet },
    { href: "/reports/ledger", label: "House Ledger", icon: ShieldCheck }
  ]
};

export function Sidebar({ user }: { user: SessionUser }) {
  const currentPath = usePathname();
  const navItems = navConfig[user.role];

  return (
    <aside className="no-print flex flex-col gap-4 rounded-3xl border bg-card p-4 shadow-soft lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)]">
      <div className="space-y-2 rounded-3xl bg-secondary p-4">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Work Society</p>
        <h2 className="text-xl font-bold">Management System</h2>
        <Badge variant="outline">{user.role === "ADMIN" ? "Admin access" : "Street access"}</Badge>
      </div>

      <nav className="grid gap-2">
        {navItems.map((item) => {
          const isActive = currentPath === item.href || currentPath.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-base font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
                isActive && "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
