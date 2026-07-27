import { NextResponse } from "next/server";
import { z } from "zod";
import { hashPassword } from "@/lib/auth";
import { createUser, findUserByEmail } from "@/lib/db";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["ADMIN", "ANALYST", "VIEWER"]).optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

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

    return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } }, { status: 201 });
  } catch (error) {
    console.error("Registration error", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Registration failed" }, { status: 500 });
  }
}
