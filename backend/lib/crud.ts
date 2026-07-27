import { db } from "@/lib/pg";

export async function listUsers() {
  const result = await db.query(
    'SELECT id, name, email, role, "createdAt" FROM "User" ORDER BY "createdAt" DESC'
  );
  return result.rows;
}

// ===================== WORKSPACES =====================

export async function createWorkspace(data: {
  name: string;
  slug: string;
  description?: string;
}) {
  const result = await db.query(
    `INSERT INTO "Workspace"
    (id, name, slug, description, "createdAt", "updatedAt")
    VALUES ($1, $2, $3, $4, NOW(), NOW())
    RETURNING id, name, slug, description, "createdAt", "updatedAt"`,
    [
      `ws_${Date.now()}`,
      data.name,
      data.slug,
      data.description ?? null,
    ]
  );

  return result.rows[0];
}

export async function listWorkspaces() {
  const result = await db.query(
    'SELECT id, name, slug, description, "createdAt" FROM "Workspace" ORDER BY "createdAt" DESC'
  );
  return result.rows;
}

// ===================== FEEDBACK =====================

export async function createFeedback(data: {
  workspaceId: string;
  content: string;
  customerName?: string;
  email?: string;
  source?: string;
}) {
  const result = await db.query(
    `INSERT INTO "Feedback"
    (id, "workspaceId", "customerName", email, content, source, "createdAt", "updatedAt")
    VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
    RETURNING id, "workspaceId", "customerName", email, content, source, "createdAt", "updatedAt"`,
    [
      `fb_${Date.now()}`,
      data.workspaceId,
      data.customerName ?? null,
      data.email ?? null,
      data.content,
      data.source ?? "MANUAL",
    ]
  );

  return result.rows[0];
}

export async function listFeedback() {
  const result = await db.query(
    'SELECT id, "workspaceId", "customerName", email, content, source, "createdAt" FROM "Feedback" ORDER BY "createdAt" DESC'
  );
  return result.rows;
}

// ===================== THEMES =====================

export async function createTheme(data: {
  workspaceId: string;
  name: string;
  description?: string;
  confidence?: number;
}) {
  const result = await db.query(
    `INSERT INTO "Theme"
    (id, "workspaceId", name, description, confidence, "createdAt", "updatedAt")
    VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
    RETURNING id, "workspaceId", name, description, confidence, "createdAt", "updatedAt"`,
    [
      `th_${Date.now()}`,
      data.workspaceId,
      data.name,
      data.description ?? null,
      data.confidence ?? null,
    ]
  );

  return result.rows[0];
}

export async function listThemes() {
  const result = await db.query(
    'SELECT id, "workspaceId", name, description, confidence, "createdAt" FROM "Theme" ORDER BY "createdAt" DESC'
  );
  return result.rows;
}

// ===================== REPORTS =====================

export async function createReport(data: {
  workspaceId: string;
  type: string;
  title: string;
  period: string;
  summary?: string;
  recommendations?: unknown;
}) {
  const result = await db.query(
    `INSERT INTO "Report"
    (id, "workspaceId", type, title, period, summary, recommendations, "generatedAt")
    VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
    RETURNING id, "workspaceId", type, title, period, summary, recommendations, "generatedAt"`,
    [
      `rp_${Date.now()}`,
      data.workspaceId,
      data.type,
      data.title,
      data.period,
      data.summary ?? null,
      JSON.stringify(data.recommendations ?? []),
    ]
  );

  return result.rows[0];
}

export async function listReports() {
  const result = await db.query(
    'SELECT id, "workspaceId", type, title, period, summary, recommendations, "generatedAt" FROM "Report" ORDER BY "generatedAt" DESC'
  );
  return result.rows;
}