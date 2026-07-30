import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
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

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "daily";

    const now = new Date();
    const startDate = new Date(now);

    if (type === "weekly") {
      startDate.setDate(now.getDate() - 7);
    } else if (type === "monthly") {
      startDate.setDate(now.getDate() - 30);
    } else {
      startDate.setHours(0, 0, 0, 0);
    }

    const feedbacks = await prisma.feedback.findMany({
      where: {
        workspaceId: membership.workspaceId,
        createdAt: {
          gte: startDate,
          lte: now,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(feedbacks);
  } catch (error) {
    console.error("Reports API error:", error);

    return NextResponse.json(
      { error: "Failed to fetch report data" },
      { status: 500 }
    );
  }
}