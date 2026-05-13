import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { createFeeCycle } from "@/lib/repositories";
import { feeCycleSchema } from "@/lib/validations/fee-cycle";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json();
  const parsed = feeCycleSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please fill in the fee cycle form correctly." }, { status: 400 });
  }

  try {
    const cycle = await createFeeCycle(parsed.data, session);
    return NextResponse.json({ data: cycle });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to generate cycle." }, { status: 400 });
  }
}
