import Link from "next/link";

import { PageHeader } from "@/components/shared/page-header";
import { PrintActions } from "@/components/shared/print-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireSession } from "@/lib/auth";
import { getReceiptDetail } from "@/lib/repositories";
import { formatCurrency, formatDate, formatMonthYear } from "@/lib/utils";

type ReceiptPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ReceiptPage({ params }: ReceiptPageProps) {
  const session = await requireSession();
  const { id } = await params;
  const receipt = await getReceiptDetail(id, session);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Receipt Detail"
        description="Use the print button for a paper receipt or save it as PDF using the browser print dialog."
        actions={
          <>
            <PrintActions />
            <Button asChild className="no-print">
              <Link href="/collections">Back to collection</Link>
            </Button>
          </>
        }
      />

      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>{receipt.receipt.receiptNumber}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border p-4">
              <p className="text-sm font-semibold text-muted-foreground">Society</p>
              <p className="mt-1 text-xl font-bold">Work Society Management System</p>
            </div>
            <div className="rounded-2xl border p-4">
              <p className="text-sm font-semibold text-muted-foreground">Collected by</p>
              <p className="mt-1 text-xl font-bold">{receipt.collectorName}</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 rounded-2xl border p-4">
              <p><span className="font-semibold">House:</span> {receipt.house.houseNumber}</p>
              <p><span className="font-semibold">Street:</span> {receipt.street.number}</p>
              <p><span className="font-semibold">Owner:</span> {receipt.house.ownerName}</p>
            </div>
            <div className="space-y-2 rounded-2xl border p-4">
              <p><span className="font-semibold">Month:</span> {formatMonthYear(receipt.cycle.month, receipt.cycle.year)}</p>
              <p><span className="font-semibold">Payment date:</span> {formatDate(receipt.payment.paymentDate)}</p>
              <p><span className="font-semibold">Receipt number:</span> {receipt.receipt.receiptNumber}</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-secondary p-4">
              <p className="text-sm font-semibold text-muted-foreground">Amount received</p>
              <p className="mt-2 text-2xl font-bold">{formatCurrency(receipt.payment.amount)}</p>
            </div>
            <div className="rounded-2xl bg-secondary p-4">
              <p className="text-sm font-semibold text-muted-foreground">Balance due</p>
              <p className="mt-2 text-2xl font-bold">{formatCurrency(receipt.receipt.balanceAfterPayment)}</p>
            </div>
            <div className="rounded-2xl bg-secondary p-4">
              <p className="text-sm font-semibold text-muted-foreground">Payment method</p>
              <p className="mt-2 text-2xl font-bold">{receipt.payment.paymentMethod.replaceAll("_", " ")}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
