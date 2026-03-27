import type { ILogger } from '../infrastructure/logging/index.ts'
import { createLogger } from '../infrastructure/logging/index.ts'
import { prisma } from '../lib/prisma.ts'
import { PrismaTodoRepository } from '../repositories/todo.repository.ts'
import { TodoService } from '../services/todo.service.ts'

export interface AppConfig {
  environment: string
}

export interface AppContext {
  logger: ILogger
  config: AppConfig
}

export interface ServiceContainer {
  appContext: AppContext
  todoService: TodoService
}

export function createContainer(): ServiceContainer {
  const environment = process.env['NODE_ENV'] ?? 'development'
  const logger = createLogger({ environment })
  const config: AppConfig = { environment }
  const appContext: AppContext = { logger, config }

  const todoRepo = new PrismaTodoRepository(appContext, prisma)
  const todoService = new TodoService(appContext, todoRepo)

  return { appContext, todoService }
}
