"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import {
  adjustmentSchema,
  type AdjustmentInput,
  type AdjustmentSchemaInput
} from "@/lib/validations/adjustment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

export function BalanceAdjustmentForm({
  houses
}: {
  houses: Array<{ id: string; houseNumber: string; streetNumber: string; latestDueId?: string }>;
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<AdjustmentSchemaInput, undefined, AdjustmentInput>({
    resolver: zodResolver(adjustmentSchema),
    defaultValues: {
      houseId: houses[0]?.id ?? "",
      feeDueId: houses[0]?.latestDueId ?? "",
      amount: 0,
      reason: ""
    }
  });

  async function onSubmit(values: AdjustmentInput) {
    setServerError(null);
    const response = await fetch("/api/balance-adjustments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });
    const payload = await response.json();
    if (!response.ok) {
      setServerError(payload.error ?? "Unable to adjust balance.");
      return;
    }
    form.reset({
      houseId: houses[0]?.id ?? "",
      feeDueId: houses[0]?.latestDueId ?? "",
      amount: 0,
      reason: ""
    });
    router.refresh();
  }

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label htmlFor="adjustment-house">House</Label>
        <Select
          id="adjustment-house"
          {...form.register("houseId")}
          onChange={(event) => {
            const selected = houses.find((house) => house.id === event.target.value);
            form.setValue("houseId", event.target.value);
            form.setValue("feeDueId", selected?.latestDueId ?? "");
          }}
        >
          {houses.map((house) => (
            <option key={house.id} value={house.id}>
              House {house.houseNumber} - Street {house.streetNumber}
            </option>
          ))}
        </Select>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="adjustment-amount">Adjustment amount</Label>
          <Input id="adjustment-amount" type="number" {...form.register("amount")} />
          <p className="text-xs text-muted-foreground">Use a negative amount to reduce dues.</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="adjustment-reason">Reason</Label>
          <Input id="adjustment-reason" {...form.register("reason")} />
        </div>
      </div>
      {serverError ? <p className="text-sm text-destructive">{serverError}</p> : null}
      <Button disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Saving..." : "Apply adjustment"}
      </Button>
    </form>
  );
}
