import { existsSync, readFileSync } from "fs";
import path from "path";
import { Pool } from "pg";

function loadEnvFiles() {
  const roots = [process.cwd(), path.resolve(process.cwd(), "..")];

  for (const root of roots) {
    for (const fileName of [".env.local", ".env"]) {
      const filePath = path.join(root, fileName);
      if (!existsSync(filePath)) continue;

      const contents = readFileSync(filePath, "utf8");
      for (const line of contents.split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
        const separatorIndex = trimmed.indexOf("=");
        const key = trimmed.slice(0, separatorIndex).trim();
        let value = trimmed.slice(separatorIndex + 1).trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  }
}

loadEnvFiles();

const connectionString = process.env.DATABASE_URL || process.env.DATABASE_URL_UNPOOLED;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined. Make sure the workspace root .env file is loaded.");
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

export const db = pool;
