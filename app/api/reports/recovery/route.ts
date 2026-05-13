import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { getRecoveryCsvRows } from "@/lib/repositories";
import { toCsv } from "@/lib/utils";

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const url = new URL(request.url);
  const month = url.searchParams.get("month");
  const year = url.searchParams.get("year");
  const rows = await getRecoveryCsvRows(session, {
    month: month ? Number(month) : undefined,
    year: year ? Number(year) : undefined
  });
  const csv = toCsv(rows);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="recovery-report.csv"'
    }
  });
}
