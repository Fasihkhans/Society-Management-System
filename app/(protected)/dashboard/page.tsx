import { BarChart3, Home, Landmark, TrendingUp } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireSession } from "@/lib/auth";
import { getDashboardData } from "@/lib/repositories";
import { formatCurrency, formatMonthYear } from "@/lib/utils";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await requireSession();
  const dashboard = await getDashboardData(session);

  return (
    <div className="space-y-4">
      <PageHeader
        title={session.role === "ADMIN" ? "Admin Dashboard" : "Street Representative Dashboard"}
        description="Large summary cards, quick actions, and street-wise recovery percentages keep daily work simple."
        actions={
          <>
            {dashboard.quickActions.map((action) => (
              <Button key={action.href} asChild>
                <Link href={action.href}>{action.label}</Link>
              </Button>
            ))}
          </>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total houses" value={String(dashboard.houseCount)} helper="Accessible houses" icon={<Home className="h-6 w-6" />} />
        <StatCard label="Total streets" value={String(dashboard.streetCount)} helper="Available streets in your access scope" icon={<Landmark className="h-6 w-6" />} />
        <StatCard label="Collected amount" value={formatCurrency(dashboard.totalCollected)} helper="All recorded collections" icon={<BarChart3 className="h-6 w-6" />} />
        <StatCard label="Pending amount" value={formatCurrency(dashboard.totalPending)} helper="Old and current pending dues" icon={<TrendingUp className="h-6 w-6" />} />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Current cycle</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-2xl bg-secondary p-4">
              <span className="font-semibold">Month / year</span>
              <Badge variant="outline">
                {dashboard.currentCycle
                  ? formatMonthYear(dashboard.currentCycle.month, dashboard.currentCycle.year)
                  : "Not generated"}
              </Badge>
            </div>
            <div className="flex items-center justify-between rounded-2xl border p-4">
              <span className="font-semibold">Current month collection</span>
              <span className="text-lg font-bold">{formatCurrency(dashboard.currentMonthCollection)}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border p-4">
              <span className="font-semibold">Current month pending</span>
              <span className="text-lg font-bold">{formatCurrency(dashboard.currentMonthPending)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick guidance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Use the house search before entering a payment.</p>
            <p>Generate monthly dues once per month and year only.</p>
            <p>Balance adjustments always require a reason and are audit logged.</p>
            <p>Street representatives are automatically restricted to their own street data.</p>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Street-wise recovery</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="table-wrap">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Street</TableHead>
                    <TableHead>Representative</TableHead>
                    <TableHead className="text-right">Expected</TableHead>
                    <TableHead className="text-right">Received</TableHead>
                    <TableHead className="text-right">Pending</TableHead>
                    <TableHead className="text-right">Recovery %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dashboard.streetRecovery.map((row) => (
                    <TableRow key={row.streetId}>
                      <TableCell className="font-medium">Street {row.streetNumber}</TableCell>
                      <TableCell>{row.representative}</TableCell>
                      <TableCell className="text-right">{formatCurrency(row.expected)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(row.received)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(row.pending)}</TableCell>
                      <TableCell className="text-right">{row.recovery}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
