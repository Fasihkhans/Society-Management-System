"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatDate, formatMonthYear } from "@/lib/utils";
import {
  viewerVerificationSchema,
  type ViewerVerificationInput,
  type ViewerVerificationSchemaInput
} from "@/lib/validations/auth";

type ViewerResult = {
  resident: { fullName: string };
  house: { houseNumber: string };
  street: { number: string };
  receipts: Array<{
    id: string;
    receiptNumber: string;
    houseNumber: string;
    streetNumber: string;
    month: number;
    year: number;
    amount: number;
    paymentDate: string;
    pendingAfterPayment: number;
  }>;
  pendingTotal: number;
};

export function ViewerVerificationForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [result, setResult] = useState<ViewerResult | null>(null);

  const form = useForm<ViewerVerificationSchemaInput, undefined, ViewerVerificationInput>({
    resolver: zodResolver(viewerVerificationSchema),
    defaultValues: {
      houseNumber: "A-31",
      cnic: "35202-1234567-1",
      mobile: "0312-555-0101"
    }
  });

  async function onSubmit(values: ViewerVerificationInput) {
    setServerError(null);
    setResult(null);
    const response = await fetch("/api/viewer/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });

    const payload = await response.json();

    if (!response.ok) {
      setServerError(payload.error ?? "Verification failed.");
      return;
    }

    setResult(payload.data);
  }

  return (
    <div className="space-y-6">
      <form className="grid gap-4 md:grid-cols-3" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <Label htmlFor="houseNumber">House number</Label>
          <Input id="houseNumber" {...form.register("houseNumber")} />
          {form.formState.errors.houseNumber ? (
            <p className="text-sm text-destructive">{form.formState.errors.houseNumber.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="cnic">CNIC</Label>
          <Input id="cnic" {...form.register("cnic")} />
          {form.formState.errors.cnic ? (
            <p className="text-sm text-destructive">{form.formState.errors.cnic.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="mobile">Mobile number</Label>
          <Input id="mobile" {...form.register("mobile")} />
          {form.formState.errors.mobile ? (
            <p className="text-sm text-destructive">{form.formState.errors.mobile.message}</p>
          ) : null}
        </div>

        <div className="md:col-span-3">
          <Button size="lg" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Verifying..." : "Verify and view receipts"}
          </Button>
        </div>
      </form>

      {serverError ? <p className="text-sm text-destructive">{serverError}</p> : null}

      {result ? (
        <Card>
          <CardHeader>
            <CardTitle>{result.resident.fullName}</CardTitle>
            <p className="text-sm text-muted-foreground">
              House {result.house.houseNumber}, Street {result.street.number}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl bg-secondary p-4">
              <p className="text-sm font-semibold text-muted-foreground">Pending dues</p>
              <p className="mt-1 text-2xl font-bold">{formatCurrency(result.pendingTotal)}</p>
            </div>

            <div className="table-wrap">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Receipt #</TableHead>
                      <TableHead>Month / Year</TableHead>
                      <TableHead>House</TableHead>
                      <TableHead>Street</TableHead>
                      <TableHead>Payment date</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.receipts.map((receipt) => (
                      <TableRow key={receipt.id}>
                        <TableCell className="font-medium">{receipt.receiptNumber}</TableCell>
                        <TableCell>{formatMonthYear(receipt.month, receipt.year)}</TableCell>
                        <TableCell>{receipt.houseNumber}</TableCell>
                        <TableCell>{receipt.streetNumber}</TableCell>
                        <TableCell>{formatDate(receipt.paymentDate)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(receipt.amount)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
