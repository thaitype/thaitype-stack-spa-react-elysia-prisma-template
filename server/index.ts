import { Elysia, t } from "elysia";
import { prisma } from "./lib/prisma";
import { auth } from "./lib/auth";
import { PrismaTodoRepository } from "./repositories/todo.repository";
import { TodoService } from "./services/todo.service";
import { TodoServiceError } from "./services/errors";

// --- Composition Root: wire dependencies here ---
const todoRepo = new PrismaTodoRepository(prisma);
const todoService = new TodoService(todoRepo);

// --- Auth guard: extracts session from request, returns 401 if unauthenticated ---
async function getSessionUser(request: Request): Promise<{ id: string } | null> {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) return null;
  return session.user;
}

const app = new Elysia()
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

  // --- Better Auth handler: handles all /api/auth/* routes ---
  .mount(auth.handler)

  // --- Todo routes (session-protected) ---
  .get("/api/todos", async ({ todoService, request }) => {
    const user = await getSessionUser(request);
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    return todoService.getAll(user.id);
  })

  .get(
    "/api/todos/:id",
    async ({ todoService, params: { id }, request }) => {
      const user = await getSessionUser(request);
      if (!user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }
      return todoService.getById(id, user.id);
    },
    {
      params: t.Object({ id: t.String() }),
    },
  )

  .post(
    "/api/todos",
    async ({ todoService, body, request }) => {
      const user = await getSessionUser(request);
      if (!user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }
      return todoService.create(user.id, body);
    },
    {
      body: t.Object({
        title: t.String({ minLength: 1 }),
        description: t.Optional(t.String()),
      }),
    },
  )

  .patch(
    "/api/todos/:id",
    async ({ todoService, params: { id }, body, request }) => {
      const user = await getSessionUser(request);
      if (!user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }
      return todoService.update(id, user.id, body);
    },
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
    async ({ todoService, params: { id }, request }) => {
      const user = await getSessionUser(request);
      if (!user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }
      await todoService.delete(id, user.id);
      return { success: true };
    },
    {
      params: t.Object({ id: t.String() }),
    },
  )

  .listen(3001);

console.log(`Server running at http://localhost:${app.server?.port}`);

export type App = typeof app;
