import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '#/lib/eden'

export interface Todo {
  id: string
  title: string
  description: string | null
  completed: boolean
  createdAt: string
  updatedAt: string
  userId: string
}

export function useGetTodos() {
  return useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      const { data, error } = await api.api.todos.get()
      if (error) throw error
      return data as unknown as Todo[]
    },
  })
}

export function useCreateTodo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (body: { title: string; description?: string }) => {
      const { data, error } = await api.api.todos.post(body)
      if (error) throw error
      return data as unknown as Todo
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  })
}

export function useUpdateTodo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (params: {
      id: string
      title?: string
      description?: string | null
      completed?: boolean
    }) => {
      const { id, description, ...rest } = params
      const body: { title?: string; description?: string; completed?: boolean } = { ...rest }
      // Server schema only accepts string | undefined for description (not null)
      if (description !== undefined) {
        body.description = description ?? undefined
      }
      const { data, error } = await api.api.todos({ id }).patch(body)
      if (error) throw error
      return data as unknown as Todo
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  })
}

export function useDeleteTodo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await api.api.todos({ id }).delete()
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  })
}
