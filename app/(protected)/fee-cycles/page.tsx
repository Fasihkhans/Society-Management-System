import { FeeCycleForm } from "@/components/fee-cycles/fee-cycle-form";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireAdmin } from "@/lib/auth";
import { listFeeCycles } from "@/lib/repositories";
import { formatDate, formatMonthYear } from "@/lib/utils";

export default async function FeeCyclesPage() {
  const session = await requireAdmin();
  const cycles = await listFeeCycles(session);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Monthly Fee Generation"
        description="Generate monthly dues once per month and year. The system prevents duplicate cycles."
      />
      <section className="grid gap-4 lg:grid-cols-[0.9fr,1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Generate a fee cycle</CardTitle>
          </CardHeader>
          <CardContent>
            <FeeCycleForm />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Existing cycles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="table-wrap">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cycle</TableHead>
                      <TableHead>Generated on</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cycles.map((cycle) => (
                      <TableRow key={cycle.id}>
                        <TableCell className="font-medium">{formatMonthYear(cycle.month, cycle.year)}</TableCell>
                        <TableCell>{formatDate(cycle.generatedAt)}</TableCell>
                        <TableCell>{cycle.notes || "No notes"}</TableCell>
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
