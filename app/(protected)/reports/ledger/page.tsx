import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireSession } from "@/lib/auth";
import { getHouseLedger } from "@/lib/repositories";
import { formatCurrency, formatDate, formatMonthYear } from "@/lib/utils";

type LedgerPageProps = {
  searchParams: Promise<{ houseId?: string }>;
};

export default async function LedgerPage({ searchParams }: LedgerPageProps) {
  const session = await requireSession();
  const params = await searchParams;
  const ledger = await getHouseLedger(session, params.houseId);

  return (
    <div className="space-y-4">
      <PageHeader
        title="House Ledger"
        description="Track month-wise dues, receipts, partial payments, and remaining balance house by house."
      />

      <Card>
        <CardContent className="p-6">
          <form>
            <Select name="houseId" defaultValue={params.houseId ?? ledger.selectedHouse?.id}>
              {ledger.houses.map((house) => (
                <option key={house.id} value={house.id}>
                  House {house.houseNumber} - Street {house.street.number}
                </option>
              ))}
            </Select>
          </form>
        </CardContent>
      </Card>

      {ledger.selectedHouse ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle>
                {ledger.selectedHouse.houseNumber} - {ledger.selectedHouse.ownerName}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border p-4">
                <p className="text-sm font-semibold text-muted-foreground">Street</p>
                <p className="mt-1 text-xl font-bold">Street {ledger.selectedHouse.street.number}</p>
              </div>
              <div className="rounded-2xl border p-4">
                <p className="text-sm font-semibold text-muted-foreground">Monthly fee</p>
                <p className="mt-1 text-xl font-bold">{formatCurrency(ledger.selectedHouse.monthlyFeeAmount)}</p>
              </div>
              <div className="rounded-2xl border p-4">
                <p className="text-sm font-semibold text-muted-foreground">Total pending</p>
                <p className="mt-1 text-xl font-bold">{formatCurrency(ledger.totalPending)}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ledger rows</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="table-wrap">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Month</TableHead>
                        <TableHead className="text-right">Opening balance</TableHead>
                        <TableHead className="text-right">Amount due</TableHead>
                        <TableHead className="text-right">Received</TableHead>
                        <TableHead className="text-right">Balance</TableHead>
                        <TableHead>Last payment</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ledger.rows.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell className="font-medium">{formatMonthYear(row.cycle.month, row.cycle.year)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(row.openingBalance)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(row.amountDue)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(row.amountReceived)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(row.balanceRemaining)}</TableCell>
                          <TableCell>
                            {row.payments.at(-1) ? formatDate(row.payments.at(-1)!.paymentDate) : "No payment"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  );
}
