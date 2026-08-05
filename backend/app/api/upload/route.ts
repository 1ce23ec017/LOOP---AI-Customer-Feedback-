import { NextResponse } from "next/server";
import { parse } from "csv-parse/sync";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/permissions";
import { analyzeFeedback } from "@/lib/claude";

export async function POST(request: Request) {
  try {
    await requireRole(["ADMIN", "ANALYST"]);

    const formData = await request.formData();

    console.log("========== UPLOAD DEBUG ==========");

    console.log("FormData Keys:");
    for (const key of formData.keys()) {
      console.log(key);
    }

    console.log("FormData Entries:");
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    const workspaceId = formData.get("workspaceId")?.toString() || "";

    // Find the uploaded file even if the field name is different
    let file: File | null = null;

    const possibleFields = ["file", "feedback", "csv", "upload"];

    for (const field of possibleFields) {
      const value = formData.get(field);

      if (value instanceof File && value.size > 0) {
        file = value;
        console.log("Found file using field:", field);
        break;
      }
    }

    // Fallback: search every FormData entry
    if (!file) {
      for (const [, value] of formData.entries()) {
        if (value instanceof File && value.size > 0) {
          file = value;
          console.log("Found file automatically.");
          break;
        }
      }
    }

    console.log("workspaceId =", workspaceId);
    console.log("file =", file);

    if (!workspaceId) {
      return NextResponse.json(
        {
          error: "workspaceId not received",
        },
        { status: 400 }
      );
    }

    if (!file) {
      return NextResponse.json(
        {
          error: "File not received",
        },
        { status: 400 }
      );
    }

    const csvText = await file.text();

    console.log("CSV:");
    console.log(csvText);

    const rows = parse(csvText, {
      columns: true,
      skip_empty_lines: true,
    });

    console.log("Rows:", rows);

    const createdFeedback = [];

    for (const row of rows) {
      const content = String(
        row.content ??
          row.feedback ??
          row.comment ??
          ""
      ).trim();

      if (!content) continue;

      const analysis = await analyzeFeedback(content);

      const theme = await prisma.theme.upsert({
        where: {
          id: `theme-${analysis.theme
            .toLowerCase()
            .replace(/\s+/g, "-")}`,
        },
        create: {
          id: `theme-${analysis.theme
            .toLowerCase()
            .replace(/\s+/g, "-")}`,
          workspaceId,
          name: analysis.theme,
          confidence: analysis.confidence,
        },
        update: {},
      });

      const feedback = await prisma.feedback.create({
        data: {
          workspaceId,
          content,
          source: "CSV_IMPORT",
          sentiment: analysis.sentiment,
          sentimentScore: analysis.sentimentScore,
          themeId: theme.id,
        },
      });

      createdFeedback.push({
        id: feedback.id,
      });
    }

    return NextResponse.json({
      message: "Upload complete",
      summary: {
        imported: createdFeedback.length,
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "CSV upload failed",
        details:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}