import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { collectPayment } from "@/lib/repositories";
import { paymentSchema } from "@/lib/validations/payment";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json();
  const parsed = paymentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please fill in the payment form correctly." }, { status: 400 });
  }

  try {
    const receipt = await collectPayment(parsed.data, session);
    return NextResponse.json({ data: { receiptId: receipt.id } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to record payment." }, { status: 400 });
  }
}
