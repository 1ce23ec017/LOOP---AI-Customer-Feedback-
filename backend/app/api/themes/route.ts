import { NextResponse } from "next/server";
import { requireRole } from "@/lib/permissions";
import { createTheme, listThemes } from "@/lib/crud";

export async function GET() {
  try {
    await requireRole(["ADMIN", "ANALYST", "VIEWER"]);
    const themes = await listThemes();
    return NextResponse.json(themes);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to load themes" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await requireRole(["ADMIN", "ANALYST"]);
    const body = await request.json();
    const theme = await createTheme(body);
    return NextResponse.json(theme, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to create theme" }, { status: 500 });
  }
}
