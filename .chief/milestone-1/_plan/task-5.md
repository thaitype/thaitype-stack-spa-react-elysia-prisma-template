# Task 5: Install shadcn/ui and build Todo frontend components

## Objective

Set up shadcn/ui component library and build the Todo app frontend — list, create, edit, toggle, delete — calling the Elysia API. Show todo UI only for authenticated users.

## Scope

**Included:**
- Install and configure shadcn/ui (with Tailwind CSS v4)
- Install required shadcn components: button, input, card, checkbox, dialog, dropdown-menu, textarea, badge
- `app/lib/api.ts` — simple fetch wrapper for `/api/todos` endpoints
- `app/components/TodoList.tsx` — main todo list with filter (all/pending/completed)
- `app/components/TodoItem.tsx` — single todo with toggle, edit, delete
- `app/components/AddTodoForm.tsx` — expandable form to create todo
- Update `app/routes/index.tsx` — landing page for unauthenticated, TodoList for authenticated

**Excluded:**
- Auth pages (task-4)
- Backend changes

## Rules & Contracts to follow

- `_ref/thaitype-stack-mongodb-template/src/app/_components/TodoList.tsx` — reference for list pattern
- `_ref/thaitype-stack-mongodb-template/src/app/_components/TodoItem.tsx` — reference for item pattern
- `_ref/thaitype-stack-mongodb-template/src/app/_components/AddTodoForm.tsx` — reference for form pattern
- Use shadcn/ui components, not raw HTML
- Use `fetch` for API calls (no tRPC — this project uses REST)
- Use TanStack Router for any navigation

## Steps

1. Initialize shadcn/ui:
   - Run `bunx shadcn@latest init` (or configure manually for Tailwind v4)
   - Install components: button, input, card, checkbox, dialog, dropdown-menu, textarea, badge
2. Create `app/lib/api.ts`:
   - Typed fetch wrapper with methods: `getTodos()`, `getTodo(id)`, `createTodo(data)`, `updateTodo(id, data)`, `deleteTodo(id)`
   - Handle error responses
3. Create `app/components/AddTodoForm.tsx`:
   - Expandable card (click to expand, Esc to collapse)
   - Fields: title (required), description (optional)
   - Submit creates todo via API, then refreshes list
4. Create `app/components/TodoItem.tsx`:
   - Checkbox to toggle completed
   - Display title + description
   - Edit mode (inline or dialog)
   - Delete with confirmation
   - Strike-through for completed
5. Create `app/components/TodoList.tsx`:
   - Fetch todos on mount
   - Filter tabs: All / Pending / Completed
   - Show count per filter
   - Render AddTodoForm + list of TodoItem
   - Loading and empty states
6. Update `app/routes/index.tsx`:
   - Use `useSession` from auth client
   - Unauthenticated: show landing page with sign up/login links
   - Authenticated: show welcome + TodoList

## Acceptance Criteria

- shadcn/ui initialized and components available
- Todo CRUD works end-to-end through the UI
- Filter tabs work (all/pending/completed)
- Authenticated users see their todos
- Unauthenticated users see landing page
- Clean, responsive UI with shadcn components

## Verification

```bash
bunx tsc --noEmit
# Manual: full flow — sign up, create todos, toggle, edit, delete, filter
```

## Deliverables

- `app/lib/api.ts`
- `app/components/AddTodoForm.tsx`
- `app/components/TodoItem.tsx`
- `app/components/TodoList.tsx`
- Updated `app/routes/index.tsx`
- shadcn/ui config files (components.json, etc.)
- Installed shadcn components under `app/components/ui/`
