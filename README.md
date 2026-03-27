# Thaitype Stack — SPA + React + Elysia + Prisma

A full-stack Todo app template using React SPA frontend with Elysia backend, Prisma ORM, and Better Auth.

## Tech Stack

- **Frontend:** React 19, Vite, TanStack Router, Tailwind CSS v4, shadcn/ui
- **Backend:** Elysia (Bun), Prisma (SQLite), Better Auth
- **Auth:** Email/password via Better Auth

## Prerequisites

- [Bun](https://bun.sh/) v1.3+

## Quick Start

```bash
# 1. Install dependencies
bun install

# 2. Set up environment
cp .env.example .env

# 3. Push database schema (creates SQLite file)
bun run db:push

# 4. Start both frontend and backend
bun run dev          # Frontend on http://localhost:3000
bun run dev:server   # Backend on http://localhost:3001 (run in a separate terminal)
```

Open http://localhost:3000 — sign up, then start adding todos.

## Scripts

| Command | Description |
|---|---|
| `bun run dev` | Start Vite dev server (port 3000) |
| `bun run dev:server` | Start Elysia backend with watch mode (port 3001) |
| `bun run build` | Build frontend for production |
| `bun run test` | Run tests with Vitest |
| `bun run db:generate` | Regenerate Prisma client |
| `bun run db:push` | Push schema to database |
| `bun run db:studio` | Open Prisma Studio |

## Environment Variables

See `.env.example`:

| Variable | Description |
|---|---|
| `DATABASE_URL` | SQLite path (default: `file:./dev.db`) |
| `BETTER_AUTH_SECRET` | Auth secret key (change in production) |
| `BETTER_AUTH_URL` | Backend URL for auth (default: `http://localhost:3001`) |

## Project Structure

```
app/                  # Frontend (React SPA)
  components/         # App components + ui/ (shadcn)
  lib/                # Auth client, API wrapper, utils
  routes/             # TanStack Router file-based routes
server/               # Backend (Elysia)
  lib/                # Prisma client, auth config
  repositories/       # Data access layer
  services/           # Business logic layer
prisma/
  schema.prisma       # Database schema
```
