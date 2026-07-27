import { randomUUID } from "crypto";
import { db } from "@/lib/pg";

export async function findUserByEmail(email: string) {
  const result = await db.query(
    'SELECT id, name, email, password, role, "createdAt", "updatedAt" FROM "User" WHERE email = $1',
    [email],
  );

  return result.rows[0] ?? null;
}

export async function createUser(data: { name: string; email: string; password: string; role: string }) {
  const id = `usr_${randomUUID()}`;
  const result = await db.query(
    'INSERT INTO "User" (id, name, email, password, role, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING id, name, email, role, "createdAt", "updatedAt"',
    [id, data.name, data.email, data.password, data.role],
  );

  return result.rows[0];
}
