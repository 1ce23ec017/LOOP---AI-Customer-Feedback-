---
name: testing-loop-apps
description: How to run and end-to-end test the LOOP AI Customer Feedback repo locally — the two independent Next.js 16 apps (frontend/ and backend/), their separate Postgres databases, Prisma setup, login credentials, and the gotchas that block a first run.
---

# Testing the LOOP apps locally

## Repo shape

Two **completely independent** Next.js 16 apps that do **not** talk to each other:

- `frontend/` — the UI **plus its own** `app/api/*` routes. next-auth v5 beta, Prisma client generated to `lib/generated/prisma`.
- `backend/` — API-only, no UI. next-auth v4-era stubs, Prisma client generated to `generated/prisma`, plus a raw `pg` pool in `lib/pg.ts`.

Each has its own `prisma/schema.prisma` and migrations, and the two schemas define **conflicting** `User`/`Workspace`/`Feedback` tables. **Give each app its own database** — do not point both at one DB.

`database/loop_db.sql` exists but is not needed; `prisma migrate deploy` is the reliable path.

## Setup that actually works

```bash
source ~/.nvm/nvm.sh && nvm use 22.12.0     # Node 20.18 CANNOT install deps (Prisma 7 needs 20.19+/22.12+)
(cd frontend && npm install && npx prisma generate)
(cd backend  && npm install && npx prisma generate)   # generated clients are gitignored
```

Postgres is usually **not** installed on a fresh box:

```bash
sudo apt-get install -y postgresql postgresql-contrib
sudo pg_ctlcluster 14 main start
sudo -u postgres psql -c "CREATE ROLE loop WITH LOGIN PASSWORD 'looppass' SUPERUSER;" \
                     -c "CREATE DATABASE loop_frontend OWNER loop;" \
                     -c "CREATE DATABASE loop_backend  OWNER loop;"
```

`frontend/.env`:
```
DATABASE_URL="postgresql://loop:looppass@localhost:5432/loop_frontend"
AUTH_SECRET="<any long string>"
NEXTAUTH_SECRET="<same>"
NEXTAUTH_URL="http://localhost:3000"
```
`backend/.env`: same but `loop_backend` and port 3001.

```bash
(cd frontend && npx prisma migrate deploy && npx tsx prisma/seed.ts)
(cd backend  && npx prisma migrate deploy)
```

Neither app boots usefully without `DATABASE_URL`; builds/typechecks work without it.

## Running

Both default to port 3000 — run the backend elsewhere:
```bash
(cd frontend && npm run dev)                # :3000
(cd backend  && npm run dev -- -p 3001)     # :3001
```

## Credentials

- Seeded frontend user: `test6@example.com` / `test123` (from `frontend/prisma/seed.ts`).
- Or sign up fresh at `/signup` — signup auto-creates a workspace + ADMIN membership, which every frontend API route requires (they 404 `Workspace not found` without one). A fresh signup is the cleanest way to get an isolated, empty workspace for assertions.
- The backend has **no login**: `lib/permissions.ts` `requireAuth()` returns a hard-coded ADMIN stub, so every backend route is callable unauthenticated. That means backend routes can be tested with plain `curl`/browser — no cookies needed — but it also means 401/403 paths are unreachable.

## Gotchas

- **`lib/pg.ts` hard-codes `ssl: { rejectUnauthorized: false }`.** Ubuntu's stock Postgres has `ssl = on` with a snakeoil cert, so this connects fine with no code change. If you land on a Postgres built with `ssl = off`, node-postgres will fail with "The server does not support SSL connections" — enable `ssl=on` in `postgresql.conf` rather than editing the app.
- **Next 16 refuses to start two dev servers from the same directory** ("Another next dev server is already running"). To run a second instance of the same app (e.g. to test a missing-env configuration), copy the app to another directory. A **symlinked** `node_modules` makes Turbopack panic ("Symlink [project]/node_modules is invalid, it points out of the filesystem root") — use a hard-link copy on the same filesystem instead:
  ```bash
  tar cf - --exclude=node_modules --exclude=.next --exclude=.env . | (cd ~/copy && tar xf -)
  cp -al <app>/node_modules ~/copy/node_modules
  (cd ~/copy && env -u DATABASE_URL npm run dev -- -p 3002)
  ```
  Note `backend/lib/pg.ts` `loadEnvFiles()` scans `cwd` **and its parent** for `.env`/`.env.local`, so place such a copy where no parent `.env` exists.
- **`ANTHROPIC_API_KEY` unset** ⇒ `backend/lib/claude.ts` returns a `NEUTRAL` / `General` / `0.5` stub. CSV upload and `/api/ask` still work, but you cannot exercise any non-`NEUTRAL` sentiment path. Say so explicitly rather than claiming sentiment analysis was verified.
- **Frontend `/reports` shows `0 Feedback records` on load** — that's the component's initial state, not a bug. Click **Download** to actually fetch and populate it.
- **Frontend feedback form hard-codes** `sentiment: "POSITIVE"`, `status: "REVIEWED"`, `theme: "Customer Support"` — don't read those as real analysis.
- **`backend/app/api/auth/login/route.ts` returns HTTP 200 "Login successful" even for a wrong password** (it ignores `signIn`'s return value, and `lib/auth.ts signIn` returns `null` rather than throwing). Known/pre-existing — do not report as a new regression unless the file's logic changed.

## Useful backend smoke sequence

```bash
B=http://localhost:3001
curl -s -X POST $B/api/workspaces -H 'Content-Type: application/json' -d '{"name":"WS","slug":"ws"}'
printf 'content\nrow one\nrow two\n' > /tmp/f.csv
curl -s -X POST $B/api/upload -F "file=@/tmp/f.csv" -F "workspaceId=<id from above>"
curl -s -X POST $B/api/ask -H 'Content-Type: application/json' -d '{"question":"one"}'
curl -s -X POST $B/api/reports/weekly -H 'Content-Type: application/json' -d '{"workspaceId":"<id>"}'
curl -s $B/api/feedback; curl -s $B/api/themes; curl -s $B/api/users
```
`/api/upload` accepts the file under any of the field names `file`, `feedback`, `csv`, `upload` and requires `workspaceId`. Backend GET endpoints render readable JSON in the browser, which is the best visual evidence available for this API-only app.

## Devin Secrets Needed

- `ANTHROPIC_API_KEY` — optional. Only required to exercise real sentiment/theme classification in `backend/lib/claude.ts`; everything else works without it.
