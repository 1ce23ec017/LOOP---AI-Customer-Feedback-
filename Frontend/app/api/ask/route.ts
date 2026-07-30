import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
    const { question } = body;

    if (!question || !question.trim()) {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 }
      );
    }

    const feedbacks = await prisma.feedback.findMany({
      where: {
        workspaceId: membership.workspaceId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
    });

    const positiveCount = feedbacks.filter(
      (feedback) => feedback.sentiment === "POSITIVE"
    ).length;

    const negativeCount = feedbacks.filter(
      (feedback) => feedback.sentiment === "NEGATIVE"
    ).length;

    const neutralCount = feedbacks.filter(
      (feedback) => feedback.sentiment === "NEUTRAL"
    ).length;

    const pendingCount = feedbacks.filter(
      (feedback) => feedback.status === "PENDING"
    ).length;

    const reviewedCount = feedbacks.filter(
      (feedback) => feedback.status === "REVIEWED"
    ).length;

    const resolvedCount = feedbacks.filter(
      (feedback) => feedback.status === "RESOLVED"
    ).length;

    let answer = "";

    const lowerQuestion = question.toLowerCase();

    if (
      lowerQuestion.includes("positive") ||
      lowerQuestion.includes("like") ||
      lowerQuestion.includes("good")
    ) {
      answer = `There are ${positiveCount} positive feedback messages in the latest ${feedbacks.length} feedback records.`;
    } else if (
      lowerQuestion.includes("negative") ||
      lowerQuestion.includes("complaint") ||
      lowerQuestion.includes("problem")
    ) {
      answer = `There are ${negativeCount} negative feedback messages in the latest ${feedbacks.length} feedback records.`;
    } else if (
      lowerQuestion.includes("neutral")
    ) {
      answer = `There are ${neutralCount} neutral feedback messages in the latest ${feedbacks.length} feedback records.`;
    } else if (
      lowerQuestion.includes("pending")
    ) {
      answer = `There are ${pendingCount} pending feedback messages that still need attention.`;
    } else if (
      lowerQuestion.includes("reviewed")
    ) {
      answer = `There are ${reviewedCount} reviewed feedback messages.`;
    } else if (
      lowerQuestion.includes("resolved")
    ) {
      answer = `There are ${resolvedCount} resolved feedback messages.`;
    } else if (
      lowerQuestion.includes("how many") ||
      lowerQuestion.includes("total") ||
      lowerQuestion.includes("feedback")
    ) {
      answer = `There are ${feedbacks.length} recent feedback messages in your workspace. ${positiveCount} are positive, ${negativeCount} are negative, and ${neutralCount} are neutral.`;
    } else {
      answer = `I found ${feedbacks.length} recent feedback messages. There are ${positiveCount} positive, ${negativeCount} negative, and ${neutralCount} neutral feedback messages.`;
    }

    return NextResponse.json({
      question,
      answer,
      feedbackCount: feedbacks.length,
      summary: {
        positive: positiveCount,
        negative: negativeCount,
        neutral: neutralCount,
        pending: pendingCount,
        reviewed: reviewedCount,
        resolved: resolvedCount,
      },
    });
  } catch (error) {
    console.error("Ask API error:", error);

    return NextResponse.json(
      { error: "Failed to process your question." },
      { status: 500 }
    );
  }
}