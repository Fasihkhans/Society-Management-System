import { NextResponse } from "next/server";

import { authenticateUser } from "@/lib/repositories";
import { createSessionToken, SESSION_COOKIE_NAME } from "@/lib/session-token";
import { loginSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Please enter a valid email and password." }, { status: 400 });
  }

  const user = await authenticateUser(parsed.data.email, parsed.data.password);
  if (!user) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const token = await createSessionToken(user);
  const response = NextResponse.json({
    redirectTo: typeof body.nextUrl === "string" && body.nextUrl.startsWith("/") ? body.nextUrl : "/dashboard"
  });

  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });

  return response;
}
