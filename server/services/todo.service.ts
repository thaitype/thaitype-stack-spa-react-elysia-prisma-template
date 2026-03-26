import type { CreateTodoData, ITodoRepository, Todo, UpdateTodoData } from "../repositories/todo.repository";
import { TodoServiceError } from "./errors";

export class TodoService {
  constructor(private repo: ITodoRepository) {}

  getAll(userId: string): Promise<Todo[]> {
    return this.repo.findByUserId(userId);
  }

  async getById(id: string, userId: string): Promise<Todo> {
    const todo = await this.repo.findById(id);
    if (!todo) throw new TodoServiceError("Todo not found", 404);
    if (todo.userId !== userId) throw new TodoServiceError("Todo not found", 404);
    return todo;
  }

  create(userId: string, data: CreateTodoData): Promise<Todo> {
    if (!data.title || data.title.trim().length === 0) {
      throw new TodoServiceError("Title is required", 400);
    }
    return this.repo.create(userId, data);
  }

  async update(id: string, userId: string, data: UpdateTodoData): Promise<Todo> {
    const todo = await this.repo.findById(id);
    if (!todo) throw new TodoServiceError("Todo not found", 404);
    if (todo.userId !== userId) throw new TodoServiceError("Todo not found", 404);

    const updated = await this.repo.update(id, data);
    if (!updated) throw new TodoServiceError("Update failed", 500);
    return updated;
  }

  async toggle(id: string, userId: string): Promise<Todo> {
    const todo = await this.repo.findById(id);
    if (!todo) throw new TodoServiceError("Todo not found", 404);
    if (todo.userId !== userId) throw new TodoServiceError("Todo not found", 404);

    const updated = await this.repo.update(id, { completed: !todo.completed });
    if (!updated) throw new TodoServiceError("Toggle failed", 500);
    return updated;
  }

  async delete(id: string, userId: string): Promise<void> {
    const todo = await this.repo.findById(id);
    if (!todo) throw new TodoServiceError("Todo not found", 404);
    if (todo.userId !== userId) throw new TodoServiceError("Todo not found", 404);

    const deleted = await this.repo.delete(id);
    if (!deleted) throw new TodoServiceError("Delete failed", 500);
  }
}
