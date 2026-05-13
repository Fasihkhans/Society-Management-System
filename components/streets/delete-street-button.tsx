"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export function DeleteStreetButton({ streetId }: { streetId: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm("Delete this street? This only works when no houses are linked.");
    if (!confirmed) {
      return;
    }

    setPending(true);
    const response = await fetch(`/api/streets/${streetId}`, {
      method: "DELETE"
    });
    const payload = await response.json();
    setPending(false);
    if (!response.ok) {
      window.alert(payload.error ?? "Unable to delete street.");
      return;
    }
    router.refresh();
  }

  return (
    <Button type="button" variant="destructive" size="sm" onClick={handleDelete} disabled={pending}>
      {pending ? "Deleting..." : "Delete"}
    </Button>
  );
}
