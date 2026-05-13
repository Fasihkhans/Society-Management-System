"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { residentTypeOptions } from "@/lib/constants";
import {
  residentSchema,
  type ResidentInput,
  type ResidentSchemaInput
} from "@/lib/validations/resident";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

export function ResidentForm({
  houses
}: {
  houses: Array<{ id: string; houseNumber: string; streetNumber: string }>;
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<ResidentSchemaInput, undefined, ResidentInput>({
    resolver: zodResolver(residentSchema),
    defaultValues: {
      houseId: houses[0]?.id ?? "",
      fullName: "",
      residentType: "TENANT",
      cnic: "",
      mobile: "",
      email: "",
      isPrimary: false
    }
  });

  async function onSubmit(values: ResidentInput) {
    setServerError(null);
    const response = await fetch("/api/residents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });
    const payload = await response.json();
    if (!response.ok) {
      setServerError(payload.error ?? "Unable to add resident.");
      return;
    }
    form.reset({
      houseId: houses[0]?.id ?? "",
      fullName: "",
      residentType: "TENANT",
      cnic: "",
      mobile: "",
      email: "",
      isPrimary: false
    });
    router.refresh();
  }

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label htmlFor="resident-house">House</Label>
        <Select id="resident-house" {...form.register("houseId")}>
          {houses.map((house) => (
            <option key={house.id} value={house.id}>
              House {house.houseNumber} - Street {house.streetNumber}
            </option>
          ))}
        </Select>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="resident-name">Resident name</Label>
          <Input id="resident-name" {...form.register("fullName")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="resident-type">Resident type</Label>
          <Select id="resident-type" {...form.register("residentType")}>
            {residentTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="resident-cnic">CNIC</Label>
          <Input id="resident-cnic" {...form.register("cnic")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="resident-mobile">Mobile</Label>
          <Input id="resident-mobile" {...form.register("mobile")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="resident-email">Email</Label>
          <Input id="resident-email" type="email" {...form.register("email")} />
        </div>
      </div>
      {serverError ? <p className="text-sm text-destructive">{serverError}</p> : null}
      <Button disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Saving..." : "Add resident"}
      </Button>
    </form>
  );
}
