import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { monthOptions } from "@/lib/constants";
import { requireSession } from "@/lib/auth";
import { getRecoveryReport } from "@/lib/repositories";
import { formatCurrency } from "@/lib/utils";

type RecoveryReportPageProps = {
  searchParams: Promise<{ month?: string; year?: string }>;
};

export default async function RecoveryReportPage({ searchParams }: RecoveryReportPageProps) {
  const session = await requireSession();
  const params = await searchParams;
  const month = params.month ? Number(params.month) : undefined;
  const year = params.year ? Number(params.year) : undefined;
  const report = await getRecoveryReport(session, { month, year });
  const exportUrl = `/api/reports/recovery${month || year ? `?month=${month ?? ""}&year=${year ?? ""}` : ""}`;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Recovery Reports"
        description="Street-wise and month-wise recovery percentages with export-ready CSV output."
        actions={
          <Button asChild>
            <a href={exportUrl}>Export CSV</a>
          </Button>
        }
      />

      <Card>
        <CardContent className="p-6">
          <form className="grid gap-3 md:grid-cols-3">
            <Select name="month" defaultValue={params.month}>
              <option value="">All months</option>
              {monthOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <Select name="year" defaultValue={params.year}>
              <option value="">All years</option>
              {[2026, 2027].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
            <Button type="submit">Apply filters</Button>
          </form>
        </CardContent>
      </Card>

      <section className="grid gap-4 xl:grid-cols-2">
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
                      <TableHead className="text-right">Expected</TableHead>
                      <TableHead className="text-right">Received</TableHead>
                      <TableHead className="text-right">Pending</TableHead>
                      <TableHead className="text-right">Recovery %</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {report.streetRows.map((row) => (
                      <TableRow key={row.streetId}>
                        <TableCell className="font-medium">{row.streetNumber}</TableCell>
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

        <Card>
          <CardHeader>
            <CardTitle>Month-wise recovery</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="table-wrap">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Month</TableHead>
                      <TableHead className="text-right">Expected</TableHead>
                      <TableHead className="text-right">Received</TableHead>
                      <TableHead className="text-right">Pending</TableHead>
                      <TableHead className="text-right">Recovery %</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {report.monthRows.map((row) => (
                      <TableRow key={row.label}>
                        <TableCell className="font-medium">{row.label}</TableCell>
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
      </section>
    </div>
  );
}
