"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { roleOptions } from "@/lib/constants";
import { userSchema, type UserInput, type UserSchemaInput } from "@/lib/validations/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

export function UserForm({
  streets
}: {
  streets: Array<{ id: string; number: string; name: string }>;
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<UserSchemaInput, undefined, UserInput>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "STREET_REP",
      assignedStreetId: streets[0]?.id ?? ""
    }
  });

  async function onSubmit(values: UserInput) {
    setServerError(null);
    const response = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });
    const payload = await response.json();
    if (!response.ok) {
      setServerError(payload.error ?? "Unable to save user.");
      return;
    }
    form.reset({
      name: "",
      email: "",
      password: "",
      role: "STREET_REP",
      assignedStreetId: streets[0]?.id ?? ""
    });
    router.refresh();
  }

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="user-name">Name</Label>
          <Input id="user-name" {...form.register("name")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="user-email">Email</Label>
          <Input id="user-email" type="email" {...form.register("email")} />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="user-password">Password</Label>
          <Input id="user-password" type="password" {...form.register("password")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="user-role">Role</Label>
          <Select id="user-role" {...form.register("role")}>
            {roleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="user-street">Assigned street</Label>
          <Select id="user-street" {...form.register("assignedStreetId")}>
            <option value="">All streets</option>
            {streets.map((street) => (
              <option key={street.id} value={street.id}>
                Street {street.number} - {street.name}
              </option>
            ))}
          </Select>
        </div>
      </div>
      {serverError ? <p className="text-sm text-destructive">{serverError}</p> : null}
      <Button disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Saving..." : "Add user"}
      </Button>
    </form>
  );
}
