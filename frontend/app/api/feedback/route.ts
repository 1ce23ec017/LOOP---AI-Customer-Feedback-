import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { analyzeFeedback } from "@/lib/ai";

// ======================
// GET FEEDBACK
// ======================

export async function GET() {
  try {
    const feedbacks = await prisma.feedback.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(feedbacks);
  } catch (error) {
    console.error("GET Feedback Error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch feedback",
      },
      {
        status: 500,
      }
    );
  }
}

// ======================
// CREATE FEEDBACK
// ======================

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      content,
      channel,
      customerLabel,
    } = body;

    if (!content || !channel) {
      return NextResponse.json(
        {
          error: "Content and channel are required",
        },
        {
          status: 400,
        }
      );
    }

    // AI Analysis
    const ai = await analyzeFeedback(content);

    // Get first workspace
    const workspace = await prisma.workspace.findFirst();

    if (!workspace) {
      return NextResponse.json(
        {
          error: "Workspace not found",
        },
        {
          status: 404,
        }
      );
    }

    const feedback = await prisma.feedback.create({
      data: {
        content,
        channel,
        customerLabel: customerLabel || null,

        sentiment: ai.sentiment,
        theme: ai.theme,
        status: "REVIEWED",

        workspaceId: workspace.id,
      },
    });

    return NextResponse.json(feedback, {
      status: 201,
    });

  } catch (error) {
    console.error("POST Feedback Error:", error);

    return NextResponse.json(
      {
        error: "Failed to create feedback",
      },
      {
        status: 500,
      }
    );
  }
}