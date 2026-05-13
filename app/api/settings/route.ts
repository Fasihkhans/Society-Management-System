import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { updateSettings } from "@/lib/repositories";
import { settingsSchema } from "@/lib/validations/settings";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json();
  const parsed = settingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please fill in the settings form correctly." }, { status: 400 });
  }

  try {
    const settings = await updateSettings(parsed.data, session);
    return NextResponse.json({ data: settings });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to save settings." }, { status: 400 });
  }
}
