import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/permissions";
import { listUsers } from "@/lib/crud";
import { hashPassword } from "@/lib/auth";
import { createUser, findUserByEmail } from "@/lib/db";

const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["ADMIN", "ANALYST", "VIEWER"]).optional(),
});

export async function GET() {
  try {
    await requireRole(["ADMIN", "ANALYST"]);
    const users = await listUsers();
    return NextResponse.json(users);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to load users" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await requireRole(["ADMIN"]);

    const body = await request.json();
    const parsed = createUserSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const existing = await findUserByEmail(parsed.data.email);
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const password = await hashPassword(parsed.data.password);
    const user = await createUser({
      name: parsed.data.name,
      email: parsed.data.email,
      password,
      role: parsed.data.role ?? "VIEWER",
    });

    return NextResponse.json(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
