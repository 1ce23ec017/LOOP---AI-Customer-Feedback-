import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// =========================
// POST
// =========================

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const membership = await prisma.workspaceMember.findFirst({
      where: {
        userId: user.id,
      },
    });

    if (!membership) {
      return NextResponse.json(
        { error: "Workspace not found" },
        { status: 404 }
      );
    }

    const body = await request.json();

    const {
      content,
      channel,
      customerLabel,
      sentiment,
      status,
      theme,
    } = body;

    if (!content || !channel) {
      return NextResponse.json(
        { error: "Content and channel are required" },
        { status: 400 }
      );
    }

    const feedback = await prisma.feedback.create({
      data: {
        content,
        channel,
        customerLabel: customerLabel || null,
        sentiment: sentiment || null,
        status: status || "PENDING",
        theme: theme || null,
        workspaceId: membership.workspaceId,
        createdById: user.id,
      },
    });

    return NextResponse.json(feedback, { status: 201 });
  } catch (error) {
    console.error("Feedback creation error:", error);

    return NextResponse.json(
      { error: "Failed to create feedback" },
      { status: 500 }
    );
  }
}

// =========================
// GET
// =========================

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const membership = await prisma.workspaceMember.findFirst({
      where: {
        userId: user.id,
      },
    });

    if (!membership) {
      return NextResponse.json(
        { error: "Workspace not found" },
        { status: 404 }
      );
    }

    const feedback = await prisma.feedback.findMany({
      where: {
        workspaceId: membership.workspaceId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(feedback);
  } catch (error) {
    console.error("Feedback fetch error:", error);

    return NextResponse.json(
      { error: "Failed to fetch feedback" },
      { status: 500 }
    );
  }
}