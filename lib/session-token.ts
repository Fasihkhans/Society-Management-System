import { jwtVerify, SignJWT } from "jose";

import type { SessionUser } from "@/lib/types";

export const SESSION_COOKIE_NAME = "work-society-session";

const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET || "work-society-development-secret-change-me"
);

export async function createSessionToken(user: SessionUser) {
  return new SignJWT(user)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifySessionToken(token: string) {
  const { payload } = await jwtVerify(token, secret);
  return payload as unknown as SessionUser;
}
