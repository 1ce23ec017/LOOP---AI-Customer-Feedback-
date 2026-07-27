import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { analyzeFeedback } from "@/lib/claude";
import { requireRole } from "@/lib/permissions";

export async function POST(request: Request) {
  try {
    await requireRole(["ADMIN", "ANALYST", "VIEWER"]);
    const body = await request.json();
    const question = String(body.question ?? "").trim();
    if (!question) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }

    const feedback = await prisma.feedback.findMany({
      where: { content: { contains: question, mode: "insensitive" } },
      take: 10,
      orderBy: { createdAt: "desc" },
    });

    const analysis = await analyzeFeedback(question);

    return NextResponse.json({
      answer: `Based on ${feedback.length} matching feedback entries, ${analysis.theme} is the most relevant theme.`,
      references: feedback.map((item: { id: string; content: string; sentiment: string | null }) => ({ id: item.id, content: item.content, sentiment: item.sentiment })),
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ error: "Ask LOOP failed" }, { status: 500 });
  }
}
