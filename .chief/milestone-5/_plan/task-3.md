# Task 3: Move todo frontend into app/features/todo/

## Objective

Group todo components and hooks into `app/features/todo/`. Keep shared components in `app/components/`. Update imports.

## Scope

**Included:**
- Move `app/components/TodoList.tsx` → `app/features/todo/components/TodoList.tsx`
- Move `app/components/TodoItem.tsx` → `app/features/todo/components/TodoItem.tsx`
- Move `app/components/AddTodoForm.tsx` → `app/features/todo/components/AddTodoForm.tsx`
- Move `app/hooks/useTodos.ts` → `app/features/todo/hooks/useTodos.ts`
- Create `app/features/todo/index.ts` — barrel export
- Update imports in `app/routes/index.tsx`
- Delete empty `app/hooks/` dir
- Keep in `app/components/`: Header.tsx, Footer.tsx, ThemeToggle.tsx, ui/

**Excluded:**
- Backend changes
- Auth components (login/signup are simple enough to stay in routes for now)

## Steps

1. Create `app/features/todo/components/` and `app/features/todo/hooks/` directories
2. Move 3 todo components and 1 hook file
3. Create `app/features/todo/index.ts`:
   ```ts
   export { TodoList } from './components/TodoList'
   export { TodoItem } from './components/TodoItem'
   export { AddTodoForm } from './components/AddTodoForm'
   export { useGetTodos, useCreateTodo, useUpdateTodo, useDeleteTodo } from './hooks/useTodos'
   export type { Todo } from './hooks/useTodos'
   ```
4. Update `app/routes/index.tsx` — import from `#/features/todo`
5. Fix internal imports within moved files (TodoList imports TodoItem, AddTodoForm, useTodos)
6. Delete old files and empty directories

## Acceptance Criteria

- `app/features/todo/` contains all todo-specific components and hooks
- `app/components/` only has shared layout + ui primitives
- All imports resolve correctly
- No orphaned files

## Verification

```bash
bunx tsc --noEmit
```
