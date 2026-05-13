import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { createHouse } from "@/lib/repositories";
import { houseSchema } from "@/lib/validations/house";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json();
  const parsed = houseSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please fill in the house form correctly." }, { status: 400 });
  }

  try {
    const house = await createHouse(parsed.data, session);
    return NextResponse.json({ data: house });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to create house." }, { status: 400 });
  }
}
