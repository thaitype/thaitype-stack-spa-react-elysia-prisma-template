# Task 2: Replace manual types and route schemas with prismabox-generated ones

## Objective

Remove manual `Todo`, `CreateTodoData`, `UpdateTodoData` interfaces. Use Prisma-generated types for the domain model and prismabox TypeBox schemas for route validation. Use `t.Pick` / `t.Partial` where generated schemas don't match exactly.

## Scope

**Included:**
- Update `server/modules/todo/todo.repository.ts`:
  - Remove manual `Todo`, `CreateTodoData`, `UpdateTodoData` interfaces
  - Import `Todo` type from Prisma generated client (the runtime type)
  - Define `CreateTodoData` and `UpdateTodoData` using TypeScript's `Pick` / `Partial` from the Prisma `Todo` type
- Update `server/modules/todo/todo.routes.ts`:
  - Import prismabox schemas: `TodoPlain`, `TodoPlainInputCreate`, etc.
  - Replace manual `t.Object({...})` with prismabox schemas or `t.Pick(TodoPlain, [...])`
  - For create body: `t.Pick(TodoPlain, ['title', 'description'])` or use `TodoPlainInputCreate` if it fits
  - For update body: `t.Partial(t.Pick(TodoPlain, ['title', 'description', 'completed']))`
  - For response: `TodoPlain` for single, `t.Array(TodoPlain)` for list
- Update `server/modules/todo/todo.service.ts` — fix any import changes
- Update `app/features/todo/hooks/useTodos.ts` — Todo type should flow from Eden (no changes needed if route types are clean)

**Excluded:**
- User/Session/Account models (no routes for them yet)

## Key Pattern

```ts
// todo.routes.ts
import { TodoPlain } from '../../../generated/prismabox/Todo'

// Create body: pick only title + description from TodoPlain
const CreateTodoBody = t.Pick(TodoPlain, ['title', 'description'])

// Update body: partial of title + description + completed
const UpdateTodoBody = t.Partial(t.Pick(TodoPlain, ['title', 'description', 'completed']))

.post('/', handler, { body: CreateTodoBody, response: TodoPlain })
.patch('/:id', handler, { body: UpdateTodoBody, response: TodoPlain })
```

```ts
// todo.repository.ts
import type { Todo } from '../../../generated/client/client.ts'

// Derive create/update types from Prisma's Todo
export type CreateTodoData = Pick<Todo, 'title'> & Partial<Pick<Todo, 'description'>>
export type UpdateTodoData = Partial<Pick<Todo, 'title' | 'description' | 'completed'>>
```

## IMPORTANT

- Read the generated prismabox output FIRST to understand what schemas are available
- The generated `TodoPlainInputCreate` may include `userId` and other fields we don't want in the API body — in that case use `t.Pick` / `t.Omit` to select only the fields we need
- `description` in Prisma is `String?` (nullable) — make sure the TypeBox schema handles Optional correctly
- Run `bunx prisma generate` before starting if schemas don't exist yet

## Acceptance Criteria

- Zero manual TypeBox schemas in todo.routes.ts (all derived from prismabox)
- Zero manual domain type interfaces (all from Prisma types)
- Eden types still work end-to-end
- Create/update validation still enforces required fields

## Verification

```bash
bunx tsc --noEmit
```
