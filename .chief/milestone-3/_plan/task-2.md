# Task 2: Create AppContext and container factory, wire into Elysia

## Objective

Create AppContext (logger + config), createContainer factory, refactor services/repositories to accept appContext, and wire container into Elysia.

## Scope

**Included:**
- `server/context/app-context.ts` — AppContext interface + ServiceContainer interface + createContainer()
- Update `TodoService` — accept appContext as first constructor arg, use logger
- Update `PrismaTodoRepository` — accept appContext as first constructor arg, use logger
- Update `server/index.ts` — replace manual wiring with createContainer(), decorate with container
- Update route handlers to use `container.todoService`

**Excluded:**
- Changes to auth (Better Auth manages its own context)

## Pattern (from reference)

```ts
export interface AppContext {
  logger: ILogger
  config: AppConfig
}

export interface ServiceContainer {
  appContext: AppContext
  todoService: TodoService
}

export function createContainer(): ServiceContainer {
  const logger = createLogger({ environment: process.env.NODE_ENV })
  const appContext: AppContext = { logger, config: { ... } }
  const prismaInstance = prisma
  const todoRepo = new PrismaTodoRepository(appContext, prismaInstance)
  const todoService = new TodoService(appContext, todoRepo)
  return { appContext, todoService }
}
```

## Steps

1. Create `server/context/app-context.ts`:
   - Define AppContext (logger, config)
   - Define AppConfig (environment, etc.)
   - Define ServiceContainer (appContext, todoService)
   - Export createContainer() factory
2. Update `server/repositories/todo.repository.ts`:
   - PrismaTodoRepository constructor: `(appContext: AppContext, prisma: PrismaClient)`
   - Add logger calls on create/update/delete operations
3. Update `server/services/todo.service.ts`:
   - TodoService constructor: `(appContext: AppContext, repo: ITodoRepository)`
   - Add logger calls on key operations
4. Update `server/index.ts`:
   - Replace manual wiring with `const container = createContainer()`
   - Decorate with container: `.decorate('container', container)`
   - Update route handlers: `container.todoService` instead of `todoService`
   - Log server start with container.appContext.logger

## Acceptance Criteria

- createContainer() returns fully wired ServiceContainer
- Services and repositories receive appContext and use logger
- server/index.ts is clean — no manual repo/service instantiation
- All routes work as before

## Verification

```bash
bunx tsc --noEmit
```
