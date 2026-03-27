import type { PrismaClient } from "../../generated/client/client.ts";
import type { AppContext } from "../context/app-context.ts";

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
  constructor(
    private appContext: AppContext,
    private prisma: PrismaClient,
  ) {}

  findAll(): Promise<Todo[]> {
    this.appContext.logger.debug("PrismaTodoRepository.findAll");
    return this.prisma.todo.findMany();
  }

  findById(id: string): Promise<Todo | null> {
    this.appContext.logger.debug("PrismaTodoRepository.findById", { id });
    return this.prisma.todo.findUnique({ where: { id } });
  }

  findByUserId(userId: string): Promise<Todo[]> {
    this.appContext.logger.debug("PrismaTodoRepository.findByUserId", { userId });
    return this.prisma.todo.findMany({ where: { userId } });
  }

  create(userId: string, data: CreateTodoData): Promise<Todo> {
    this.appContext.logger.info("PrismaTodoRepository.create", { userId, title: data.title });
    return this.prisma.todo.create({
      data: {
        title: data.title,
        description: data.description,
        userId,
      },
    });
  }

  async update(id: string, data: UpdateTodoData): Promise<Todo | null> {
    this.appContext.logger.info("PrismaTodoRepository.update", { id });
    try {
      return await this.prisma.todo.update({ where: { id }, data });
    } catch {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    this.appContext.logger.info("PrismaTodoRepository.delete", { id });
    try {
      await this.prisma.todo.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}
