import { BalanceAdjustmentForm } from "@/components/shared/balance-adjustment-form";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireSession } from "@/lib/auth";
import { getHouseLedger, getPendingDuesData } from "@/lib/repositories";
import { formatCurrency, formatMonthYear } from "@/lib/utils";

type PendingDuesPageProps = {
  searchParams: Promise<{ search?: string }>;
};

export default async function PendingDuesPage({ searchParams }: PendingDuesPageProps) {
  const session = await requireSession();
  const params = await searchParams;
  const pending = await getPendingDuesData(session, { search: params.search });
  const ledger = await getHouseLedger(session);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Pending Dues"
        description="Review pending amounts by street and house. Admin can apply balance adjustments with a reason."
      />
      <section className="grid gap-4 lg:grid-cols-[0.85fr,1.15fr]">
        <Card>
          <CardHeader>
            <CardTitle>Street summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-2xl bg-secondary p-4">
              <p className="text-sm font-semibold text-muted-foreground">Total pending</p>
              <p className="mt-1 text-2xl font-bold">{formatCurrency(pending.totalPending)}</p>
            </div>
            {pending.groupedByStreet.map((street) => (
              <div key={street.streetId} className="rounded-2xl border p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">Street {street.streetNumber}</p>
                    <p className="text-sm text-muted-foreground">{street.representativeName}</p>
                  </div>
                  <p className="text-lg font-bold">{formatCurrency(street.pendingAmount)}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>House pending list</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form>
              <Input name="search" placeholder="Search by house, owner, street, or mobile..." defaultValue={params.search} />
            </form>
            <div className="table-wrap">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>House</TableHead>
                      <TableHead>Street</TableHead>
                      <TableHead>Month</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pending.pendingRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{record.house.houseNumber}</TableCell>
                        <TableCell>{record.street.number}</TableCell>
                        <TableCell>{formatMonthYear(record.cycle.month, record.cycle.year)}</TableCell>
                        <TableCell><StatusBadge status={record.status} /></TableCell>
                        <TableCell className="text-right">{formatCurrency(record.balanceRemaining)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {session.role === "ADMIN" ? (
        <Card>
          <CardHeader>
            <CardTitle>Balance adjustment</CardTitle>
          </CardHeader>
          <CardContent>
            <BalanceAdjustmentForm
              houses={ledger.houses.map((house) => ({
                id: house.id,
                houseNumber: house.houseNumber,
                streetNumber: house.street.number,
                latestDueId: ledger.selectedHouse?.id === house.id ? ledger.rows.at(-1)?.id : undefined
              }))}
            />
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
