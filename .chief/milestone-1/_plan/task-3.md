# Task 3: Create Elysia Todo API routes with CRUD endpoints

## Objective

Wire the Todo service into Elysia routes, creating a full REST API for Todo CRUD at `/api/todos`. Follow the Elysia composition root pattern from the draft reference.

## Scope

**Included:**
- Update `server/index.ts` to compose dependencies (Prisma client, repository, service)
- Create Todo routes: GET /api/todos, GET /api/todos/:id, POST /api/todos, PATCH /api/todos/:id, DELETE /api/todos/:id
- Request/response validation using Elysia's `t` (TypeBox)
- Error handling with custom error class
- For now, use a hardcoded userId (auth comes in task-4)

**Excluded:**
- Authentication middleware (task-4)
- Frontend integration (task-5)

## Rules & Contracts to follow

- `_ref/draft/index.ts` -- follow Elysia pattern: `.error()`, `.decorate()`, route handlers
- Goal: clean, type-safe API with Elysia validation

## Steps

1. Update `server/index.ts`:
   - Import PrismaClient, PrismaTodoRepository, TodoService
   - Wire dependencies in composition root
   - Register TodoServiceError with `.error()`
   - Decorate with `todoService`
2. Add routes under `/api/todos` prefix:
   - GET `/api/todos` -- list todos for user
   - GET `/api/todos/:id` -- get single todo
   - POST `/api/todos` -- create todo (body: title, description?)
   - PATCH `/api/todos/:id` -- update todo (body: title?, description?, completed?)
   - DELETE `/api/todos/:id` -- delete todo
3. Add proper error mapping in `.onError()`
4. Use hardcoded userId placeholder (e.g. "temp-user-id") until auth is implemented

## Acceptance Criteria

- All 5 CRUD endpoints exist and use Elysia validation
- Composition root follows DI pattern
- Error responses return proper HTTP status codes
- TypeBox schemas validate request bodies and params
- Server starts without errors

## Verification

```bash
bunx tsc --noEmit
# Manual: start server and test with curl
```

## Deliverables

- Updated `server/index.ts` (with full composition root and routes)
