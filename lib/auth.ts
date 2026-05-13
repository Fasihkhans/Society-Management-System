import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { createSessionToken, SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/session-token";
import type { SessionUser } from "@/lib/types";

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    return await verifySessionToken(token);
  } catch {
    return null;
  }
}

export async function setSession(user: SessionUser) {
  const cookieStore = await cookies();
  const token = await createSessionToken(user);

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function requireSession() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return session;
}

export async function requireAdmin() {
  const session = await requireSession();

  if (session.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return session;
}
