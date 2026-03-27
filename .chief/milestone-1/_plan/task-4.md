# Task 4: Integrate Better Auth with Elysia and Prisma

## Objective

Set up Better Auth for email/password authentication, wire it into Elysia as API routes, create a frontend auth client, and protect the Todo API endpoints with session-based auth (replacing the hardcoded userId).

## Scope

**Included:**
- `server/lib/auth.ts` — Better Auth server config with Prisma adapter
- Mount Better Auth handler on Elysia at `/api/auth/*`
- `app/lib/auth-client.ts` — Better Auth React client (`useSession`, `signIn`, `signUp`, `signOut`)
- Auth middleware/guard for Todo routes — extract userId from session
- Update `server/index.ts` to remove hardcoded `TEMP_USER_ID` and use session user
- Create login and signup pages (`app/routes/login.tsx`, `app/routes/signup.tsx`)
- Update root layout to show auth state (login/logout in header)

**Excluded:**
- Todo UI components (task-5)
- Password reset flow
- Role-based access

## Rules & Contracts to follow

- `_ref/thaitype-stack-mongodb-template/src/server/lib/auth.ts` — follow Better Auth config pattern
- `_ref/thaitype-stack-mongodb-template/src/lib/auth-client.ts` — follow client setup pattern
- Better Auth docs: https://www.better-auth.com/docs
- Use Prisma adapter for Better Auth (not MongoDB)
- Email/password plugin for auth

## Steps

1. Create `server/lib/auth.ts`:
   - Configure `betterAuth` with Prisma adapter
   - Enable email/password auth
   - Set secret from `BETTER_AUTH_SECRET` env var
   - Set baseURL to `http://localhost:3000` (proxied via Vite)
2. Mount Better Auth in `server/index.ts`:
   - Add catch-all route `/api/auth/*` that delegates to Better Auth handler
   - Better Auth handles its own routing internally
3. Create `app/lib/auth-client.ts`:
   - Use `createAuthClient` from `better-auth/react`
   - Export `useSession`, `signIn`, `signUp`, `signOut`
4. Create auth guard for Todo routes:
   - Extract session from request headers using Better Auth
   - Return 401 if no valid session
   - Pass `userId` to TodoService methods
5. Update `server/index.ts`:
   - Remove `TEMP_USER_ID`
   - Apply auth guard to all `/api/todos` routes
   - Use `session.user.id` as userId
6. Create `app/routes/login.tsx` — login form with email/password
7. Create `app/routes/signup.tsx` — signup form with name/email/password
8. Update `app/components/Header.tsx` — show user name + logout when authenticated, login link when not

## Acceptance Criteria

- Better Auth server initializes with Prisma adapter
- `/api/auth/*` routes work (signup, signin, signout, session)
- Frontend auth client can sign up, sign in, check session
- Todo API returns 401 for unauthenticated requests
- Todo API uses real userId from session
- Login/signup pages functional
- Header shows auth state

## Verification

```bash
bunx prisma db push
bunx tsc --noEmit
# Manual: start both servers, sign up, sign in, verify todos are user-scoped
```

## Deliverables

- `server/lib/auth.ts`
- `app/lib/auth-client.ts`
- `app/routes/login.tsx`
- `app/routes/signup.tsx`
- Updated `server/index.ts`
- Updated `app/components/Header.tsx`
