"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { paymentMethodOptions } from "@/lib/constants";
import { formatCurrency, formatMonthYear } from "@/lib/utils";
import {
  paymentSchema,
  type PaymentInput,
  type PaymentSchemaInput
} from "@/lib/validations/payment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

export function CollectionForm({
  dueOptions
}: {
  dueOptions: Array<{
    id: string;
    houseNumber: string;
    ownerName: string;
    streetNumber: string;
    month: number;
    year: number;
    remainingBalance: number;
  }>;
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<PaymentSchemaInput, undefined, PaymentInput>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      feeDueId: dueOptions[0]?.id ?? "",
      amountReceived: dueOptions[0]?.remainingBalance ?? 0,
      paymentDate: new Date().toISOString().slice(0, 10),
      paymentMethod: "CASH",
      notes: ""
    }
  });

  async function onSubmit(values: PaymentInput) {
    setServerError(null);
    const response = await fetch("/api/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });
    const payload = await response.json();
    if (!response.ok) {
      setServerError(payload.error ?? "Unable to record payment.");
      return;
    }
    router.push(`/receipts/${payload.data.receiptId}`);
    router.refresh();
  }

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label htmlFor="dueId">Select due record</Label>
        <Select id="dueId" {...form.register("feeDueId")}>
          {dueOptions.map((due) => (
            <option key={due.id} value={due.id}>
              {due.houseNumber} | Street {due.streetNumber} | {formatMonthYear(due.month, due.year)} |
              Balance {formatCurrency(due.remainingBalance)}
            </option>
          ))}
        </Select>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="amountReceived">Amount received</Label>
          <Input id="amountReceived" type="number" min="1" {...form.register("amountReceived")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="paymentDate">Payment date</Label>
          <Input id="paymentDate" type="date" {...form.register("paymentDate")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="paymentMethod">Payment method</Label>
          <Select id="paymentMethod" {...form.register("paymentMethod")}>
            {paymentMethodOptions.map((method) => (
              <option key={method.value} value={method.value}>
                {method.label}
              </option>
            ))}
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="payment-notes">Notes</Label>
        <Input id="payment-notes" {...form.register("notes")} />
      </div>
      {serverError ? <p className="text-sm text-destructive">{serverError}</p> : null}
      <Button size="lg" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Saving..." : "Save payment and generate receipt"}
      </Button>
    </form>
  );
}
