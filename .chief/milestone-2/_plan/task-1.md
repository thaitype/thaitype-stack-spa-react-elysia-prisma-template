# Task 1: Remove CORS, proxy all traffic through Vite, concurrently dev script

## Objective

Eliminate CORS by routing all frontend requests through Vite proxy in dev. Update auth client and server to use relative URLs. Run frontend + backend with a single `bun run dev` command using concurrently.

## Scope

**Included:**
- Remove `@elysiajs/cors` usage from `server/index.ts`
- Remove `@elysiajs/cors` package
- Update `app/lib/auth-client.ts` — remove hardcoded `baseURL`, use relative URL (empty string or `/`)
- Update `server/lib/auth.ts` — remove `trustedOrigins`, adjust `baseURL`
- Update `vite.config.ts` — ensure proxy covers `/api` (already done)
- Install `concurrently` as dev dependency
- Update `package.json`:
  - `dev` → runs both frontend and backend via concurrently
  - `dev:frontend` → `vite dev --port 3000`
  - `dev:server` → `bun run --watch server/index.ts`
  - `start` → `bun run server/index.ts` (production, single server)

**Excluded:**
- Static file serving (task-2)
- Dockerfile (task-2)

## Steps

1. `bun remove @elysiajs/cors`
2. `bun add -d concurrently`
3. Update `server/index.ts` — remove cors import and `.use(cors(...))`
4. Update `app/lib/auth-client.ts` — set `baseURL` to `""` (uses current origin, works with proxy)
5. Update `server/lib/auth.ts`:
   - `baseURL` should use env var or default to `http://localhost:3001`
   - Remove `trustedOrigins` (no cross-origin anymore in dev since proxy)
6. Update `package.json` scripts:
   - `"dev": "concurrently \"bun run dev:frontend\" \"bun run dev:server\""`
   - `"dev:frontend": "vite dev --port 3000"`
   - `"dev:server": "bun run --watch server/index.ts"`
   - `"start": "bun run server/index.ts"`

## Acceptance Criteria

- No CORS middleware in server
- Auth client uses relative URLs (proxy handles routing)
- `bun run dev` starts both frontend and backend
- Signup/login/todo still works through proxy

## Verification

```bash
bunx tsc --noEmit
```
