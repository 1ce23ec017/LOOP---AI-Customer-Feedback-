import { compare, hash } from "bcrypt";
import { NextResponse } from "next/server";
import { z } from "zod";
import { findUserByEmail } from "@/lib/db";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function signIn(provider: string, credentials: Record<string, unknown>) {
  if (provider !== "credentials") {
    return null;
  }

  const parsed = credentialsSchema.safeParse(credentials);
  if (!parsed.success) {
    return null;
  }

  const user = await findUserByEmail(parsed.data.email);
  if (!user) {
    return null;
  }

  const isValidPassword = await compare(parsed.data.password, user.password);
  if (!isValidPassword) {
    return null;
  }

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  };
}

export async function signOut() {
  return null;
}

export async function auth() {
  return null;
}

export const handlers = {
  GET: async () => NextResponse.json({ ok: true }),
  POST: async () => NextResponse.json({ ok: true }),
};

export async function hashPassword(password: string) {
  return hash(password, 12);
}
