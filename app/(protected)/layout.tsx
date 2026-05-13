import type { ReactNode } from "react";

import { AppHeader } from "@/components/layout/app-header";
import { Sidebar } from "@/components/layout/sidebar";
import { requireSession } from "@/lib/auth";

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const session = await requireSession();

  return (
    <main className="container py-4 md:py-6">
      <div className="grid gap-4 lg:grid-cols-[280px,1fr]">
        <Sidebar user={session} />
        <div className="space-y-4">
          <AppHeader user={session} />
          {children}
        </div>
      </div>
    </main>
  );
}
