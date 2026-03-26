# Task 1: Set up Elysia backend server with dev proxy and Prisma schema

## Objective

Create the Elysia backend server entry point, install all required dependencies (Elysia, Prisma, Better Auth), configure Prisma with SQLite for local dev, and set up Vite proxy so the SPA can call the backend API.

## Scope

**Included:**
- Install dependencies: `elysia`, `@elysiajs/cors`, `@elysiajs/static`, `prisma`, `@prisma/client`, `better-auth`
- Create `server/index.ts` as the Elysia entry point (port 3001)
- Create `prisma/schema.prisma` with SQLite provider and Todo + User + Session + Account models
- Run `prisma generate`
- Update `vite.config.ts` to proxy `/api` requests to `http://localhost:3001`
- Add `dev:server` script to `package.json` (e.g. `bun run --watch server/index.ts`)
- Create `.env.example` with DATABASE_URL and BETTER_AUTH_SECRET placeholders

**Excluded:**
- Todo routes (task-2/3)
- Auth routes (task-4)
- Frontend changes beyond proxy config

## Rules & Contracts to follow

- `.chief/_rules/_goal/goal.md` -- use Elysia, Prisma, minimal clean architecture
- `_ref/draft/index.ts` -- follow Elysia composition root pattern (decorate for DI)

## Steps

1. Install backend dependencies via bun
2. Create `prisma/schema.prisma` with models: User (for Better Auth), Session, Account, Todo
3. Create `server/index.ts` with basic Elysia server on port 3001 with CORS
4. Update `vite.config.ts` to add proxy for `/api` to localhost:3001
5. Update `package.json` scripts: `dev:server`, update `dev` to run both
6. Create `.env.example`
7. Run `bunx prisma generate`

## Acceptance Criteria

- `server/index.ts` exists and exports Elysia app
- `prisma/schema.prisma` exists with Todo model (id, title, description, completed, userId, createdAt, updatedAt)
- Vite proxy configured for `/api`
- `bun run dev:server` starts the Elysia server
- `bunx prisma generate` succeeds without errors

## Verification

```bash
bunx prisma generate
bunx tsc --noEmit
```

## Deliverables

- `server/index.ts`
- `prisma/schema.prisma`
- `.env.example`
- Updated `package.json`
- Updated `vite.config.ts`
- Updated `tsconfig.json` (if needed for server files)
