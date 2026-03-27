export interface Todo {
  id: string
  title: string
  description: string | null
  completed: boolean
  createdAt: string
  updatedAt: string
  userId: string
}

export interface CreateTodoData {
  title: string
  description?: string
}

export interface UpdateTodoData {
  title?: string
  description?: string | null
  completed?: boolean
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || `HTTP error ${response.status}`)
  }
  return response.json() as Promise<T>
}

export async function getTodos(): Promise<Todo[]> {
  const response = await fetch("/api/todos", {
    credentials: "include",
  })
  return handleResponse<Todo[]>(response)
}

export async function getTodo(id: string): Promise<Todo> {
  const response = await fetch(`/api/todos/${id}`, {
    credentials: "include",
  })
  return handleResponse<Todo>(response)
}

export async function createTodo(data: CreateTodoData): Promise<Todo> {
  const response = await fetch("/api/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  })
  return handleResponse<Todo>(response)
}

export async function updateTodo(id: string, data: UpdateTodoData): Promise<Todo> {
  const response = await fetch(`/api/todos/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  })
  return handleResponse<Todo>(response)
}

export async function deleteTodo(id: string): Promise<void> {
  const response = await fetch(`/api/todos/${id}`, {
    method: "DELETE",
    credentials: "include",
  })
  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || `HTTP error ${response.status}`)
  }
}
