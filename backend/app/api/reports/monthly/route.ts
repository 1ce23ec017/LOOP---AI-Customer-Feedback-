import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/permissions";

export async function POST(request: Request) {
  try {
    await requireRole(["ADMIN", "ANALYST"]);
    const body = await request.json();
    const workspaceId = String(body.workspaceId ?? "").trim();
    if (!workspaceId) {
      return NextResponse.json({ error: "workspaceId is required" }, { status: 400 });
    }

    const feedback = await prisma.feedback.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "desc" },
    });

    const report = await prisma.report.create({
      data: {
        workspaceId,
        type: "monthly",
        title: "Monthly Report",
        period: "month",
        summary: `Reviewed ${feedback.length} feedback entries this month.`,
        recommendations: ["Monitor sentiment trends", "Prepare executive summary"],
      },
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ error: "Monthly report generation failed" }, { status: 500 });
  }
}
