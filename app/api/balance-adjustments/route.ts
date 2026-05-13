import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { adjustBalance } from "@/lib/repositories";
import { adjustmentSchema } from "@/lib/validations/adjustment";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json();
  const parsed = adjustmentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please fill in the adjustment form correctly." }, { status: 400 });
  }

  try {
    const due = await adjustBalance(parsed.data, session);
    return NextResponse.json({ data: due });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to adjust balance." }, { status: 400 });
  }
}
