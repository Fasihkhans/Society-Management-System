import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { createUser } from "@/lib/repositories";
import { userSchema } from "@/lib/validations/user";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json();
  const parsed = userSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please fill in the user form correctly." }, { status: 400 });
  }

  try {
    const user = await createUser(parsed.data, session);
    return NextResponse.json({ data: user });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to create user." }, { status: 400 });
  }
}
