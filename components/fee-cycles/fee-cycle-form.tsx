"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { monthOptions } from "@/lib/constants";
import {
  feeCycleSchema,
  type FeeCycleInput,
  type FeeCycleSchemaInput
} from "@/lib/validations/fee-cycle";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function FeeCycleForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<FeeCycleSchemaInput, undefined, FeeCycleInput>({
    resolver: zodResolver(feeCycleSchema),
    defaultValues: {
      month: 4,
      year: 2026,
      notes: ""
    }
  });

  async function onSubmit(values: FeeCycleInput) {
    setServerError(null);
    const response = await fetch("/api/fee-cycles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });
    const payload = await response.json();
    if (!response.ok) {
      setServerError(payload.error ?? "Unable to generate fee cycle.");
      return;
    }
    router.refresh();
  }

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="cycle-month">Month</Label>
          <Select id="cycle-month" {...form.register("month")}>
            {monthOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="cycle-year">Year</Label>
          <Select id="cycle-year" {...form.register("year")}>
            {[2026, 2027, 2028].map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="cycle-notes">Notes</Label>
        <Textarea id="cycle-notes" rows={4} {...form.register("notes")} />
      </div>
      {serverError ? <p className="text-sm text-destructive">{serverError}</p> : null}
      <Button disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Generating..." : "Generate monthly dues"}
      </Button>
    </form>
  );
}
