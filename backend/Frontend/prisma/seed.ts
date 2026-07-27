import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const password = await bcrypt.hash("test123", 10);

  const user = await prisma.user.upsert({
    where: {
      email: "test6@example.com",
    },
    update: {},
    create: {
      name: "Test User",
      email: "test6@example.com",
      password,
    },
  });

  const workspace = await prisma.workspace.create({
    data: {
      name: "Project LOOP Workspace",
    },
  });

  await prisma.workspaceMember.create({
    data: {
      userId: user.id,
      workspaceId: workspace.id,
      role: "ADMIN",
    },
  });

  console.log("Seed completed successfully");
  console.log("User:", user.email);
  console.log("Workspace:", workspace.name);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });