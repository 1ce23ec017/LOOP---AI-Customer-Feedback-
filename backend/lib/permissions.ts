import { Role } from "@prisma/client";

export async function requireAuth() {
  return {
    user: {
      id: "temp-user",
      email: "admin@example.com",
      role: "ADMIN" as Role,
    },
  };
}

export async function requireRole(allowedRoles: Role[]) {
  const session = await requireAuth();

  if (!allowedRoles.includes(session.user.role)) {
    throw new Error("Forbidden");
  }

  return session;
}