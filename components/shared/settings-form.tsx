"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import {
  settingsSchema,
  type SettingsInput,
  type SettingsSchemaInput
} from "@/lib/validations/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function SettingsForm({ initialValues }: { initialValues: SettingsInput }) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<SettingsSchemaInput, undefined, SettingsInput>({
    resolver: zodResolver(settingsSchema),
    defaultValues: initialValues
  });

  async function onSubmit(values: SettingsInput) {
    setServerError(null);
    const response = await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });
    const payload = await response.json();
    if (!response.ok) {
      setServerError(payload.error ?? "Unable to save settings.");
      return;
    }
    router.refresh();
  }

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="societyName">Society name</Label>
          <Input id="societyName" {...form.register("societyName")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="receiptPrefix">Receipt prefix</Label>
          <Input id="receiptPrefix" {...form.register("receiptPrefix")} />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="defaultDueDay">Default due day</Label>
          <Input id="defaultDueDay" type="number" min="1" max="28" {...form.register("defaultDueDay")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="supportPhone">Support phone</Label>
          <Input id="supportPhone" {...form.register("supportPhone")} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="viewerNotice">Viewer notice</Label>
        <Textarea id="viewerNotice" rows={5} {...form.register("viewerNotice")} />
      </div>
      {serverError ? <p className="text-sm text-destructive">{serverError}</p> : null}
      <Button disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Saving..." : "Save settings"}
      </Button>
    </form>
  );
}
