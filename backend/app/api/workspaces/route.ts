import { NextResponse } from "next/server";
import { requireRole } from "@/lib/permissions";
import { createWorkspace, listWorkspaces } from "@/lib/crud";

export async function GET() {
  try {
    await requireRole(["ADMIN", "ANALYST", "VIEWER"]);
    const workspaces = await listWorkspaces();
    return NextResponse.json(workspaces);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to load workspaces" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await requireRole(["ADMIN", "ANALYST"]);
    const body = await request.json();
    const workspace = await createWorkspace(body);
    return NextResponse.json(workspace, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to create workspace" }, { status: 500 });
  }
}
