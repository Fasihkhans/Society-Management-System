import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { monthOptions } from "@/lib/constants";
import type { DueStatus, RoleName } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0
  }).format(value);
}

export function formatDate(value: string | Date) {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("en-PK", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(date);
}

export function formatMonthYear(month: number, year: number) {
  const label = monthOptions.find((item) => item.value === month)?.label ?? `Month ${month}`;
  return `${label} ${year}`;
}

export function getDueBadgeClass(status: DueStatus) {
  if (status === "PAID") {
    return "bg-success/10 text-success";
  }
  if (status === "PARTIAL") {
    return "bg-warning/10 text-warning";
  }
  return "bg-destructive/10 text-destructive";
}

export function getRoleLabel(role: RoleName) {
  return role === "ADMIN" ? "Super Admin" : "Street Representative";
}

export function normalizeString(value: string) {
  return value.trim().toLowerCase();
}

export function toCsv(rows: Array<Record<string, string | number>>) {
  if (rows.length === 0) {
    return "";
  }

  const headers = Object.keys(rows[0]);

  return [
    headers.join(","),
    ...rows.map((row) =>
      headers
        .map((header) => `"${String(row[header] ?? "").replace(/"/g, '""')}"`)
        .join(",")
    )
  ].join("\n");
}
