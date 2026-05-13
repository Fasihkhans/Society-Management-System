"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  loginSchema,
  type LoginInput,
  type LoginSchemaInput
} from "@/lib/validations/auth";

export function LoginForm({ nextUrl }: { nextUrl?: string | null }) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<LoginSchemaInput, undefined, LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "admin@worksociety.test",
      password: "Admin123!"
    }
  });

  async function onSubmit(values: LoginInput) {
    setServerError(null);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, nextUrl })
    });

    const payload = await response.json();
    if (!response.ok) {
      setServerError(payload.error ?? "Login failed.");
      return;
    }

    router.push(payload.redirectTo ?? "/dashboard");
    router.refresh();
  }

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...form.register("email")} />
        {form.formState.errors.email ? (
          <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" {...form.register("password")} />
        {form.formState.errors.password ? (
          <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
        ) : null}
      </div>

      {serverError ? <p className="text-sm text-destructive">{serverError}</p> : null}

      <Button className="w-full" size="lg" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Signing in..." : "Login"}
      </Button>
    </form>
  );
}
