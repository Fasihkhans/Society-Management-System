import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { deleteStreet, updateStreet } from "@/lib/repositories";
import { streetSchema } from "@/lib/validations/street";

type StreetRouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: StreetRouteContext) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const { id } = await context.params;
  const body = await request.json();
  const parsed = streetSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please fill in the street form correctly." }, { status: 400 });
  }

  try {
    const street = await updateStreet(id, parsed.data, session);
    return NextResponse.json({ data: street });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to update street." }, { status: 400 });
  }
}

export async function DELETE(_request: Request, context: StreetRouteContext) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const { id } = await context.params;

  try {
    await deleteStreet(id, session);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to delete street." }, { status: 400 });
  }
}
