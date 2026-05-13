import { NextResponse } from "next/server";

import { verifyViewerAccess } from "@/lib/repositories";
import { viewerVerificationSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = viewerVerificationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Please provide house number, CNIC, and mobile number." }, { status: 400 });
  }

  const data = await verifyViewerAccess(parsed.data);

  if (!data) {
    return NextResponse.json(
      { error: "No matching resident record was found for the provided details." },
      { status: 404 }
    );
  }

  return NextResponse.json({ data });
}
