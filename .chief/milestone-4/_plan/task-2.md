# Task 2: Refactor Todo components to use Eden + React Query

## Objective

Replace all manual fetch calls in Todo components with Eden treaty calls wrapped in React Query's useQuery/useMutation. Delete the old `app/lib/api.ts` fetch wrapper.

## Scope

**Included:**
- `app/hooks/useTodos.ts` — custom hooks: useGetTodos, useCreateTodo, useUpdateTodo, useDeleteTodo
- Update `app/components/TodoList.tsx` — use useGetTodos query
- Update `app/components/TodoItem.tsx` — use useUpdateTodo, useDeleteTodo mutations
- Update `app/components/AddTodoForm.tsx` — use useCreateTodo mutation
- Delete `app/lib/api.ts`

**Excluded:**
- Backend changes (none needed)

## Eden + React Query Pattern

```ts
// hooks/useTodos.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '#/lib/eden'

export function useGetTodos() {
  return useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      const { data, error } = await api.api.todos.get()
      if (error) throw error
      return data
    },
  })
}

export function useCreateTodo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (body: { title: string; description?: string }) => {
      const { data, error } = await api.api.todos.post(body)
      if (error) throw error
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  })
}
```

## Steps

1. Create `app/hooks/useTodos.ts` with all 4 hooks
2. Update `TodoList.tsx`:
   - Replace manual fetch + useState + useEffect with `useGetTodos()`
   - Use `data`, `isLoading`, `error` from the hook
3. Update `AddTodoForm.tsx`:
   - Replace manual fetch with `useCreateTodo()` mutation
   - Use `mutateAsync` for submit, `isPending` for loading state
4. Update `TodoItem.tsx`:
   - Replace manual fetch with `useUpdateTodo()` and `useDeleteTodo()` mutations
   - Toggle uses `useUpdateTodo` with `{ completed: !todo.completed }`
5. Delete `app/lib/api.ts`
6. Remove any unused Todo type imports (Eden provides types automatically)

## Acceptance Criteria

- All Todo CRUD uses Eden + React Query
- Cache invalidation on mutations (list refreshes after create/update/delete)
- Loading and error states handled
- `app/lib/api.ts` deleted
- No manual fetch calls remain for todo operations

## Verification

```bash
bunx tsc --noEmit
```
