"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { houseStatusOptions } from "@/lib/constants";
import { houseSchema, type HouseInput, type HouseSchemaInput } from "@/lib/validations/house";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function HouseForm({
  streets,
  houseId,
  initialValues
}: {
  streets: Array<{ id: string; number: string; name: string }>;
  houseId?: string;
  initialValues?: Partial<HouseInput>;
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<HouseSchemaInput, undefined, HouseInput>({
    resolver: zodResolver(houseSchema),
    defaultValues: {
      streetId: initialValues?.streetId ?? streets[0]?.id ?? "",
      houseNumber: initialValues?.houseNumber ?? "",
      ownerName: initialValues?.ownerName ?? "",
      cnic: initialValues?.cnic ?? "",
      mobile: initialValues?.mobile ?? "",
      ownerEmail: initialValues?.ownerEmail ?? "",
      status: initialValues?.status ?? "ACTIVE",
      monthlyFeeAmount: initialValues?.monthlyFeeAmount ?? 1000,
      openingBalance: initialValues?.openingBalance ?? 0,
      notes: initialValues?.notes ?? ""
    }
  });

  async function onSubmit(values: HouseInput) {
    setServerError(null);
    const response = await fetch(houseId ? `/api/houses/${houseId}` : "/api/houses", {
      method: houseId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });
    const payload = await response.json();
    if (!response.ok) {
      setServerError(payload.error ?? "Unable to save house.");
      return;
    }
    router.push("/houses");
    router.refresh();
  }

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="house-street">Street</Label>
          <Select id="house-street" {...form.register("streetId")}>
            {streets.map((street) => (
              <option key={street.id} value={street.id}>
                Street {street.number} - {street.name}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="house-number">House number</Label>
          <Input id="house-number" {...form.register("houseNumber")} />
          {form.formState.errors.houseNumber ? (
            <p className="text-sm text-destructive">{form.formState.errors.houseNumber.message}</p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="owner-name">Owner name</Label>
          <Input id="owner-name" {...form.register("ownerName")} />
          {form.formState.errors.ownerName ? (
            <p className="text-sm text-destructive">{form.formState.errors.ownerName.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="owner-email">Owner email</Label>
          <Input id="owner-email" type="email" {...form.register("ownerEmail")} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="cnic">CNIC</Label>
          <Input id="cnic" {...form.register("cnic")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="mobile">Mobile number</Label>
          <Input id="mobile" {...form.register("mobile")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select id="status" {...form.register("status")}>
            {houseStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="monthly-fee">Monthly fee amount</Label>
          <Input id="monthly-fee" type="number" min="0" {...form.register("monthlyFeeAmount")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="opening-balance">Opening balance / old pending dues</Label>
          <Input id="opening-balance" type="number" min="0" {...form.register("openingBalance")} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" rows={4} {...form.register("notes")} />
      </div>

      {serverError ? <p className="text-sm text-destructive">{serverError}</p> : null}
      <Button size="lg" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Saving..." : houseId ? "Update house" : "Add house"}
      </Button>
    </form>
  );
}
