import type { DueStatus, HouseStatus, PaymentMethod, ResidentType, RoleName } from "@/lib/types";

export const roleOptions: { value: RoleName; label: string }[] = [
  { value: "ADMIN", label: "Super Admin / Society Admin" },
  { value: "STREET_REP", label: "Street Representative" }
];

export const residentTypeOptions: { value: ResidentType; label: string }[] = [
  { value: "OWNER", label: "Owner" },
  { value: "TENANT", label: "Tenant" }
];

export const houseStatusOptions: { value: HouseStatus; label: string }[] = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" }
];

export const dueStatusOptions: { value: DueStatus; label: string }[] = [
  { value: "PAID", label: "Paid" },
  { value: "PARTIAL", label: "Partial" },
  { value: "PENDING", label: "Pending" }
];

export const paymentMethodOptions: { value: PaymentMethod; label: string }[] = [
  { value: "CASH", label: "Cash" },
  { value: "BANK_TRANSFER", label: "Bank transfer" },
  { value: "EASYPAISA", label: "Easypaisa" },
  { value: "JAZZCASH", label: "JazzCash" },
  { value: "OTHER", label: "Other" }
];

export const monthOptions = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" }
];

export const protectedRoutes = [
  "/dashboard",
  "/streets",
  "/houses",
  "/residents",
  "/fee-cycles",
  "/collections",
  "/receipts",
  "/pending-dues",
  "/reports",
  "/users",
  "/imports",
  "/settings"
];

export const adminOnlyRoutes = ["/streets", "/fee-cycles", "/users", "/imports", "/settings"];
