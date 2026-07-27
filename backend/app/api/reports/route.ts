import { NextResponse } from "next/server";
import { requireRole } from "@/lib/permissions";
import { createReport, listReports } from "@/lib/crud";

export async function GET() {
  try {
    await requireRole(["ADMIN", "ANALYST", "VIEWER"]);
    const reports = await listReports();
    return NextResponse.json(reports);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to load reports" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await requireRole(["ADMIN", "ANALYST"]);
    const body = await request.json();
    const report = await createReport(body);
    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to create report" }, { status: 500 });
  }
}
