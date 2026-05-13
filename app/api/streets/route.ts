import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { createStreet } from "@/lib/repositories";
import { streetSchema } from "@/lib/validations/street";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json();
  const parsed = streetSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please fill in the street form correctly." }, { status: 400 });
  }

  try {
    const street = await createStreet(parsed.data, session);
    return NextResponse.json({ data: street });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to create street." }, { status: 400 });
  }
}
