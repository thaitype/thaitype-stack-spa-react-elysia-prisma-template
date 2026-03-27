# Task 2: Move todo backend into server/modules/todo/

## Objective

Group todo repository, service, errors, and routes into `server/modules/todo/`. Extract routes from index.ts into a module plugin. Keep index.ts as pure composition root.

## Scope

**Included:**
- Move `server/repositories/todo.repository.ts` → `server/modules/todo/todo.repository.ts`
- Move `server/services/todo.service.ts` → `server/modules/todo/todo.service.ts`
- Move `server/services/errors.ts` → `server/modules/todo/todo.errors.ts`
- Create `server/modules/todo/todo.routes.ts` — Elysia plugin with prefix `/api/todos`, uses authPlugin
- Create `server/modules/todo/index.ts` — barrel export
- Update `server/context/app-context.ts` — fix import paths
- Update `server/index.ts` — remove inline todo routes, `.use(todoRoutes(container))`
- Delete empty `server/repositories/` and `server/services/` dirs

**Excluded:**
- Frontend changes (task-3)

## Route extraction pattern

```ts
// server/modules/todo/todo.routes.ts
import { Elysia, t } from 'elysia'
import { authPlugin } from '../../lib/auth-plugin'
import type { ServiceContainer } from '../../context/app-context'

export function createTodoRoutes(container: ServiceContainer) {
  return new Elysia({ prefix: '/api/todos' })
    .use(authPlugin)
    .get('/', ({ user }) => container.todoService.getAll(user.id), { withAuth: true })
    .get('/:id', ({ user, params: { id } }) => container.todoService.getById(id, user.id), {
      withAuth: true,
      params: t.Object({ id: t.String() }),
    })
    .post('/', ({ user, body }) => container.todoService.create(user.id, body), {
      withAuth: true,
      body: t.Object({
        title: t.String({ minLength: 1 }),
        description: t.Optional(t.String()),
      }),
    })
    .patch('/:id', ({ user, params: { id }, body }) => container.todoService.update(id, user.id, body), {
      withAuth: true,
      params: t.Object({ id: t.String() }),
      body: t.Object({
        title: t.Optional(t.String({ minLength: 1 })),
        description: t.Optional(t.String()),
        completed: t.Optional(t.Boolean()),
      }),
    })
    .delete('/:id', async ({ user, params: { id } }) => {
      await container.todoService.delete(id, user.id)
      return { success: true }
    }, {
      withAuth: true,
      params: t.Object({ id: t.String() }),
    })
}
```

```ts
// server/index.ts (clean composition root)
const container = createContainer()
const baseApp = new Elysia()
  .onError(...)
  .get('/api/health', () => ({ status: 'ok' }))
  .use(authPlugin)
  .use(createTodoRoutes(container))
```

## Acceptance Criteria

- `server/modules/todo/` contains repository, service, errors, routes
- `server/index.ts` has zero todo-specific logic
- Eden types still work (all routes visible)
- No orphaned files in old locations

## Verification

```bash
bunx tsc --noEmit
```
