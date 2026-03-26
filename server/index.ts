import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import { prisma } from "./lib/prisma";
import { PrismaTodoRepository } from "./repositories/todo.repository";
import { TodoService } from "./services/todo.service";
import { TodoServiceError } from "./services/errors";

// --- Composition Root: wire dependencies here ---
const todoRepo = new PrismaTodoRepository(prisma);
const todoService = new TodoService(todoRepo);

// Hardcoded userId until auth is implemented in task-4
const TEMP_USER_ID = "temp-user-id";

const app = new Elysia()
  .use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    }),
  )
  .error({ TODO_ERROR: TodoServiceError })
  .onError(({ error, code }) => {
    if (code === "TODO_ERROR") {
      return new Response(JSON.stringify({ error: error.message }), {
        status: error.status,
        headers: { "Content-Type": "application/json" },
      });
    }
  })

  // inject service via Elysia's built-in DI
  .decorate("todoService", todoService)

  // --- health check ---
  .get("/api/health", () => ({ status: "ok" }))

  // --- Todo routes ---
  .get("/api/todos", ({ todoService }) => todoService.getAll(TEMP_USER_ID))

  .get(
    "/api/todos/:id",
    ({ todoService, params: { id } }) => todoService.getById(id, TEMP_USER_ID),
    {
      params: t.Object({ id: t.String() }),
    },
  )

  .post(
    "/api/todos",
    ({ todoService, body }) => todoService.create(TEMP_USER_ID, body),
    {
      body: t.Object({
        title: t.String({ minLength: 1 }),
        description: t.Optional(t.String()),
      }),
    },
  )

  .patch(
    "/api/todos/:id",
    ({ todoService, params: { id }, body }) => todoService.update(id, TEMP_USER_ID, body),
    {
      params: t.Object({ id: t.String() }),
      body: t.Object({
        title: t.Optional(t.String({ minLength: 1 })),
        description: t.Optional(t.String()),
        completed: t.Optional(t.Boolean()),
      }),
    },
  )

  .delete(
    "/api/todos/:id",
    async ({ todoService, params: { id } }) => {
      await todoService.delete(id, TEMP_USER_ID);
      return { success: true };
    },
    {
      params: t.Object({ id: t.String() }),
    },
  )

  .listen(3001);

console.log(`Server running at http://localhost:${app.server?.port}`);

export type App = typeof app;
