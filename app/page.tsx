import Link from "next/link";
import { ArrowRight, ShieldCheck, Users, Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <main className="container py-10 md:py-16">
      <div className="grid gap-8 lg:grid-cols-[1.3fr,0.7fr]">
        <section className="app-surface overflow-hidden p-8 md:p-12">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-primary">
            Work Society Management System
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
            Simple society fee management for admins, street representatives, and residents.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
            Track streets, houses, residents, monthly dues, receipts, pending balances, and recovery
            reports with a layout that stays readable for older and non-technical users.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/login">
                Staff login
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/viewer">
                Viewer verification
              </Link>
            </Button>
          </div>
        </section>

        <div className="grid gap-5">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-primary" />
                Secure role-based access
              </CardTitle>
              <CardDescription>Admin, street representative, and viewer flows are kept separate.</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Wallet className="h-6 w-6 text-primary" />
                Maintenance fee workflows
              </CardTitle>
              <CardDescription>
                Generate monthly dues, record partial or full payments, and issue unique receipts.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Users className="h-6 w-6 text-primary" />
                Older-user friendly UI
              </CardTitle>
              <CardDescription>
                Large buttons, short forms, clean filters, and mobile-friendly layouts.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      <section className="mt-10 grid gap-5 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Admin</CardTitle>
            <CardDescription>Manage streets, houses, residents, dues, receipts, and reports.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Full dashboard access</li>
              <li>Monthly fee cycle generation</li>
              <li>Pending dues and recovery reports</li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Street Representative</CardTitle>
            <CardDescription>See only the assigned street and collect monthly dues.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Assigned street houses only</li>
              <li>Payment entry and receipt generation</li>
              <li>Street-only pending view</li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Viewer / House Owner</CardTitle>
            <CardDescription>No password required, only verification with house, CNIC, and mobile.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>View receipts and payment history</li>
              <li>Check pending dues</li>
              <li>No edit access</li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
