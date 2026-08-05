import { NextResponse } from "next/server";
import { z } from "zod";
import { signIn } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });

    return NextResponse.json({ message: "Login successful" }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 401 });
  }
}
