# Task 2: Elysia static serve for production + Dockerfile

## Objective

Configure Elysia to serve the built Vite frontend as static files in production. Create a Dockerfile that builds the frontend, then runs a single Elysia server serving both API and static assets.

## Scope

**Included:**
- Update `server/index.ts` — use `@elysiajs/static` to serve `app/dist/` in production
- Add SPA fallback — non-API routes serve `index.html` for client-side routing
- Create `Dockerfile` — multi-stage build (install deps → build frontend → run server)
- Create `.dockerignore`
- Add `build:all` script to package.json

**Excluded:**
- Docker Compose (out of scope)
- CI/CD pipeline

## Steps

1. Update `server/index.ts`:
   - Detect production mode via `NODE_ENV`
   - In production, use `@elysiajs/static` to serve `app/dist/` as root static files
   - Add SPA fallback: any GET request not matching `/api/*` returns `app/dist/index.html`
2. Update `package.json`:
   - `"build:all": "vite build && bunx prisma generate"`
3. Create `Dockerfile`:
   - Base: `oven/bun:1`
   - Stage 1 (build): install deps, run `bun run build:all`
   - Stage 2 (run): copy built assets + server + generated prisma client, run `bun run start`
   - Expose port 3001
4. Create `.dockerignore`: node_modules, .git, dev.db, .env

## Acceptance Criteria

- `NODE_ENV=production bun run server/index.ts` serves both API and frontend
- SPA routing works (direct URL access to `/login`, `/signup` returns index.html)
- Dockerfile builds and runs successfully
- Single port serves everything in production

## Verification

```bash
bunx tsc --noEmit
bun run build
NODE_ENV=production bun run server/index.ts
# Manual: visit http://localhost:3001, verify app loads and API works
```
