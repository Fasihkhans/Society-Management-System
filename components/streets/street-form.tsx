"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  streetSchema,
  type StreetInput,
  type StreetSchemaInput
} from "@/lib/validations/street";

export function StreetForm({
  streetId,
  initialValues,
  submitLabel = "Save street"
}: {
  streetId?: string;
  initialValues?: Partial<StreetInput>;
  submitLabel?: string;
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<StreetSchemaInput, undefined, StreetInput>({
    resolver: zodResolver(streetSchema),
    defaultValues: {
      number: initialValues?.number ?? "",
      name: initialValues?.name ?? "",
      notes: initialValues?.notes ?? ""
    }
  });

  async function onSubmit(values: StreetInput) {
    setServerError(null);
    const response = await fetch(streetId ? `/api/streets/${streetId}` : "/api/streets", {
      method: streetId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });

    const payload = await response.json();
    if (!response.ok) {
      setServerError(payload.error ?? "Unable to save street.");
      return;
    }

    if (!streetId) {
      form.reset({ number: "", name: "", notes: "" });
    }
    router.refresh();
  }

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="street-number">Street number</Label>
          <Input id="street-number" {...form.register("number")} />
          {form.formState.errors.number ? (
            <p className="text-sm text-destructive">{form.formState.errors.number.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="street-name">Street name</Label>
          <Input id="street-name" {...form.register("name")} />
          {form.formState.errors.name ? (
            <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
          ) : null}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="street-notes">Notes</Label>
        <Textarea id="street-notes" rows={4} {...form.register("notes")} />
      </div>
      {serverError ? <p className="text-sm text-destructive">{serverError}</p> : null}
      <Button disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
