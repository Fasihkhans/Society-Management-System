import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { updateHouse } from "@/lib/repositories";
import { houseSchema } from "@/lib/validations/house";

type HouseRouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: HouseRouteContext) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const { id } = await context.params;
  const body = await request.json();
  const parsed = houseSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please fill in the house form correctly." }, { status: 400 });
  }

  try {
    const house = await updateHouse(id, parsed.data, session);
    return NextResponse.json({ data: house });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to update house." }, { status: 400 });
  }
}
