import { CollectionForm } from "@/components/collections/collection-form";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireSession } from "@/lib/auth";
import { getCollectionsFormOptions, listDueRecords } from "@/lib/repositories";
import { formatCurrency, formatMonthYear } from "@/lib/utils";

type CollectionsPageProps = {
  searchParams: Promise<{ search?: string }>;
};

export default async function CollectionsPage({ searchParams }: CollectionsPageProps) {
  const session = await requireSession();
  const params = await searchParams;
  const dueOptions = await getCollectionsFormOptions(session);
  const records = await listDueRecords(session, { search: params.search });

  return (
    <div className="space-y-4">
      <PageHeader
        title="Fee Collection"
        description="Search due records, add payments, allow partial collection, and auto-generate a receipt."
      />

      <section className="grid gap-4 lg:grid-cols-[0.95fr,1.05fr]">
        <Card>
          <CardHeader>
            <CardTitle>Record payment</CardTitle>
          </CardHeader>
          <CardContent>
            <CollectionForm
              dueOptions={dueOptions.map((due) => ({
                id: due.id,
                houseNumber: due.house.houseNumber,
                ownerName: due.house.ownerName,
                streetNumber: due.street.number,
                month: due.cycle.month,
                year: due.cycle.year,
                remainingBalance: due.balanceRemaining
              }))}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Search due records</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form>
              <Input name="search" placeholder="Search by house, owner, mobile, or street..." defaultValue={params.search} />
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
                      <TableHead className="text-right">Due</TableHead>
                      <TableHead className="text-right">Received</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {records.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{record.house.houseNumber}</TableCell>
                        <TableCell>{record.street.number}</TableCell>
                        <TableCell>{formatMonthYear(record.cycle.month, record.cycle.year)}</TableCell>
                        <TableCell><StatusBadge status={record.status} /></TableCell>
                        <TableCell className="text-right">{formatCurrency(record.totalDue)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(record.amountReceived)}</TableCell>
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
    </div>
  );
}
