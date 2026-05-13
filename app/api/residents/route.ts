import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { createResident } from "@/lib/repositories";
import { residentSchema } from "@/lib/validations/resident";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json();
  const parsed = residentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please fill in the resident form correctly." }, { status: 400 });
  }

  try {
    const resident = await createResident(parsed.data, session);
    return NextResponse.json({ data: resident });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to save resident." }, { status: 400 });
  }
}
