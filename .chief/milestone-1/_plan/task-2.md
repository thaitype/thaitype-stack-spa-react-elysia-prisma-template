# Task 2: Implement Todo service and repository layers with Prisma

## Objective

Create the Todo repository (Prisma-backed) and Todo service following the minimal clean architecture pattern from the draft reference code. Services contain business logic; repositories handle data access.

## Scope

**Included:**
- `server/repositories/todo.repository.ts` -- ITodoRepository interface + PrismaTodoRepository class
- `server/services/todo.service.ts` -- TodoService class with CRUD business logic
- `server/lib/prisma.ts` -- Prisma client singleton
- Type definitions for Todo domain model

**Excluded:**
- API routes (task-3)
- Auth-related logic (task-4)
- User service/repository (defer to task-4)

## Rules & Contracts to follow

- `_ref/draft/user.repository.ts` -- follow interface + concrete class pattern
- `_ref/draft/user.service.ts` -- follow service pattern with constructor DI
- Goal: minimal clean architecture, service/repository only (no domain layer)

## Steps

1. Create `server/lib/prisma.ts` with PrismaClient singleton
2. Create `server/repositories/todo.repository.ts`:
   - Define `Todo` type (domain model)
   - Define `ITodoRepository` interface (findAll, findById, findByUserId, create, update, delete)
   - Implement `PrismaTodoRepository` class
3. Create `server/services/todo.service.ts`:
   - `TodoService` class accepting `ITodoRepository` via constructor
   - Methods: getAll(userId), getById(id, userId), create(userId, data), update(id, userId, data), toggle(id, userId), delete(id, userId)
   - Throw `TodoServiceError` for business rule violations
4. Create `server/services/errors.ts` for service error class

## Acceptance Criteria

- Repository implements full CRUD against Prisma
- Service enforces ownership (userId) on all operations
- Service throws typed errors for not-found / validation failures
- All types are explicit, no `any`
- Follows constructor-based DI pattern from draft

## Verification

```bash
bunx tsc --noEmit
```

## Deliverables

- `server/lib/prisma.ts`
- `server/repositories/todo.repository.ts`
- `server/services/todo.service.ts`
- `server/services/errors.ts`
