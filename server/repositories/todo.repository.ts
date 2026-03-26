import type { PrismaClient } from "@prisma/client";

// Domain model
export interface Todo {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateTodoData = {
  title: string;
  description?: string;
};

export type UpdateTodoData = {
  title?: string;
  description?: string;
  completed?: boolean;
};

// Contract — service depends on this, not the concrete class
export interface ITodoRepository {
  findAll(): Promise<Todo[]>;
  findById(id: string): Promise<Todo | null>;
  findByUserId(userId: string): Promise<Todo[]>;
  create(userId: string, data: CreateTodoData): Promise<Todo>;
  update(id: string, data: UpdateTodoData): Promise<Todo | null>;
  delete(id: string): Promise<boolean>;
}

// Prisma implementation
export class PrismaTodoRepository implements ITodoRepository {
  constructor(private prisma: PrismaClient) {}

  findAll(): Promise<Todo[]> {
    return this.prisma.todo.findMany();
  }

  findById(id: string): Promise<Todo | null> {
    return this.prisma.todo.findUnique({ where: { id } });
  }

  findByUserId(userId: string): Promise<Todo[]> {
    return this.prisma.todo.findMany({ where: { userId } });
  }

  create(userId: string, data: CreateTodoData): Promise<Todo> {
    return this.prisma.todo.create({
      data: {
        title: data.title,
        description: data.description,
        userId,
      },
    });
  }

  async update(id: string, data: UpdateTodoData): Promise<Todo | null> {
    try {
      return await this.prisma.todo.update({ where: { id }, data });
    } catch {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.todo.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}
