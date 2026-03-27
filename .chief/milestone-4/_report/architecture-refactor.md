# Architecture Refactor Report

## Current Structure (layer-centric)

```
server/
  context/app-context.ts
  infrastructure/logging/
  lib/auth.ts, prisma.ts
  repositories/todo.repository.ts     # all repos in one folder
  services/todo.service.ts            # all services in one folder
  services/errors.ts
  index.ts

app/
  components/Header.tsx               # layout components mixed with
  components/TodoList.tsx              # feature components mixed with
  components/ui/button.tsx             # ui primitives
  hooks/useTodos.ts                   # all hooks in one folder
  lib/eden.ts, auth-client.ts
  routes/
```

**Problems:**
- Adding a new domain (e.g. `project`, `comment`) means touching 3+ folders (repositories/, services/, hooks/, components/)
- `components/` mixes layout (Header), features (TodoList), and UI primitives (ui/)
- `hooks/` will grow into a flat dump of unrelated hooks
- No clear boundary of what belongs to "todo" vs shared code

---

## Proposed Structure (domain-centric)

### Backend

```
server/
  domains/
    todo/
      todo.repository.ts          # ITodoRepository + PrismaTodoRepository
      todo.service.ts             # TodoService
      todo.routes.ts              # Elysia route group for /api/todos
      todo.errors.ts              # domain-specific errors
    comment/                      # future domain
      comment.repository.ts
      comment.service.ts
      comment.routes.ts
  infrastructure/
    logging/                      # shared, not domain-specific
  context/
    app-context.ts                # AppContext, ServiceContainer, createContainer
  lib/
    auth.ts                       # shared auth config
    prisma.ts                     # shared db client
  index.ts                        # mounts domain routes, starts server
```

### Frontend

```
app/
  features/
    todo/
      components/TodoList.tsx
      components/TodoItem.tsx
      components/AddTodoForm.tsx
      hooks/useTodos.ts
    auth/
      components/LoginForm.tsx
      components/SignupForm.tsx
  components/                     # shared layout/UI only
    Header.tsx
    ThemeToggle.tsx
    ui/                           # shadcn primitives
  lib/                            # shared utilities
    eden.ts
    auth-client.ts
    query-client.ts
    utils.ts
  routes/                         # TanStack Router (thin, imports from features)
    index.tsx
    login.tsx
    signup.tsx
    __root.tsx
```

---

## Question: 1 domain with multiple tables — 1 repo or many?

**Answer: 1 repo per table, grouped under 1 domain folder.**

Example: a `project` domain has `project`, `project_member`, `project_label` tables:

```
server/domains/project/
  project.repository.ts           # CRUD for project table
  project-member.repository.ts    # CRUD for project_member table
  project-label.repository.ts     # CRUD for project_label table
  project.service.ts              # orchestrates all 3 repos
  project.routes.ts
```

**Why:**
- **1 repo per table** — each repo is simple, testable, single-responsibility
- **1 service orchestrates** — the service knows the business rules that span tables (e.g. "deleting a project also removes members")
- **1 folder per domain** — easy to find everything related to "project"

**Anti-pattern to avoid:** 1 mega-repo that touches 3 tables. It becomes untestable and couples unrelated queries.

---

## Route extraction pattern

Currently `server/index.ts` has all routes inline. Extract per domain:

```ts
// server/domains/todo/todo.routes.ts
import { Elysia, t } from 'elysia'
import type { ServiceContainer } from '../../context/app-context'

export function todoRoutes(container: ServiceContainer) {
  return new Elysia({ prefix: '/api/todos' })
    .get('/', ({ user }) => container.todoService.getAll(user.id))
    .get('/:id', ({ user, params: { id } }) => container.todoService.getById(id, user.id), {
      params: t.Object({ id: t.String() }),
    })
    // ... etc
}

// server/index.ts
app.use(todoRoutes(container))
```

This keeps `index.ts` as a pure composition root — mount domains, start server.

---

## Frontend features pattern

Each feature folder owns its components and hooks. Routes stay thin — they import from features:

```tsx
// app/routes/index.tsx
import { TodoList } from '#/features/todo/components/TodoList'

function HomePage() {
  return <TodoList />
}
```

```tsx
// app/features/todo/hooks/useTodos.ts
// same as today, but lives next to its components
```

**Rule of thumb:**
- If only 1 feature uses it → lives in that feature folder
- If 2+ features use it → lives in shared `components/` or `lib/`
- `components/ui/` is always shared (shadcn primitives)

---

## Summary

| Concern | Current | Proposed |
|---------|---------|----------|
| Backend grouping | By layer (services/, repositories/) | By domain (domains/todo/) |
| Frontend grouping | Flat (components/, hooks/) | By feature (features/todo/) |
| Multi-table domain | N/A | 1 repo per table, 1 service orchestrates |
| Route definitions | All in index.ts | Extracted per domain |
| Shared code | lib/, infrastructure/ | Same, unchanged |
