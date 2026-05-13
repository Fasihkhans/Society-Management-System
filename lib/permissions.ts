import { adminOnlyRoutes } from "@/lib/constants";
import type { SessionUser } from "@/lib/types";

export function isAdmin(user: SessionUser | null) {
  return user?.role === "ADMIN";
}

export function canAccessStreet(user: SessionUser, streetId: string) {
  return user.role === "ADMIN" || user.assignedStreetId === streetId;
}

export function isAdminOnlyPath(pathname: string) {
  return adminOnlyRoutes.some((route) => pathname.startsWith(route));
}
