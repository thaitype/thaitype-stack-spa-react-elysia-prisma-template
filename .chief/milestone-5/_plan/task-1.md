# Task 1: Extract auth macro into reusable plugin

## Objective

Move the Better Auth handler + withAuth macro into a named Elysia plugin so any module can `.use()` it.

## Scope

**Included:**
- Create `server/lib/auth-plugin.ts` — Elysia plugin with name `'auth'`, mounts auth.handler, defines withAuth macro
- Update `server/index.ts` — remove inline .mount() and .macro(), use authPlugin instead

**Excluded:**
- Moving routes (task-2)

## Steps

1. Create `server/lib/auth-plugin.ts`:
   ```ts
   import { Elysia } from 'elysia'
   import { auth } from './auth'

   export const authPlugin = new Elysia({ name: 'auth' })
     .mount(auth.handler)
     .macro({
       withAuth: {
         async resolve({ status, request: { headers } }) {
           const session = await auth.api.getSession({ headers })
           if (!session) return status(401)
           return { user: session.user }
         },
       },
     })
   ```

2. Update `server/index.ts`:
   - Import `authPlugin` from `./lib/auth-plugin`
   - Replace `.mount(auth.handler)` and `.macro({...})` with `.use(authPlugin)`
   - Remove direct `auth` import if no longer needed

## Acceptance Criteria

- authPlugin is a named Elysia plugin
- withAuth macro still works on all todo routes
- Eden types unchanged

## Verification

```bash
bunx tsc --noEmit
```
