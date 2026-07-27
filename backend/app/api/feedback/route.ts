import { NextResponse } from "next/server";
import { requireRole } from "@/lib/permissions";
import { z } from "zod";
import { createFeedback, listFeedback } from "@/lib/crud";

const feedbackSchema = z.object({
  workspaceId: z.string().min(1),
  content: z.string().min(1),
  customerName: z.string().optional(),
  email: z.string().email().optional(),
  source: z.enum(["MANUAL", "CSV_IMPORT", "WEB_FORM"]).optional(),
});

export async function GET() {
  try {
    await requireRole(["ADMIN", "ANALYST", "VIEWER"]);
    const feedback = await listFeedback();
    return NextResponse.json(feedback);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to load feedback" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await requireRole(["ADMIN", "ANALYST"]);
    const body = await request.json();
    const parsed = feedbackSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const feedback = await createFeedback({
      workspaceId: parsed.data.workspaceId,
      content: parsed.data.content,
      customerName: parsed.data.customerName,
      email: parsed.data.email,
      source: parsed.data.source ?? "MANUAL",
    });

    return NextResponse.json(feedback, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to create feedback" }, { status: 500 });
  }
}
