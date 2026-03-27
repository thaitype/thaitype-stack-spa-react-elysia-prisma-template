import { Elysia, t } from "elysia";
import { staticPlugin } from "@elysiajs/static";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { auth } from "./lib/auth";
import { TodoServiceError } from "./services/errors";
import { createContainer } from "./context/app-context";

const isProduction = process.env.NODE_ENV === "production";

// --- Composition Root: wire all dependencies via container ---
const container = createContainer();
const log = container.appContext.logger;

// --- Auth guard: extracts session from request, returns 401 if unauthenticated ---
async function getSessionUser(request: Request): Promise<{ id: string } | null> {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) return null;
  return session.user;
}

const baseApp = new Elysia()
  .error({ TODO_ERROR: TodoServiceError })
  .onError(({ error, code }) => {
    if (code === "TODO_ERROR") {
      return new Response(JSON.stringify({ error: error.message }), {
        status: error.status,
        headers: { "Content-Type": "application/json" },
      });
    }
    log.error("Unhandled error", {
      code,
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
  })

  // inject container via Elysia's built-in DI
  .decorate("container", container)

  // --- health check ---
  .get("/api/health", () => ({ status: "ok" }))

  // --- Better Auth handler: handles all /api/auth/* routes ---
  .mount(auth.handler)

  // --- Todo routes (session-protected) ---
  .get("/api/todos", async ({ container, request }) => {
    const user = await getSessionUser(request);
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    return container.todoService.getAll(user.id);
  })

  .get(
    "/api/todos/:id",
    async ({ container, params: { id }, request }) => {
      const user = await getSessionUser(request);
      if (!user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }
      return container.todoService.getById(id, user.id);
    },
    {
      params: t.Object({ id: t.String() }),
    },
  )

  .post(
    "/api/todos",
    async ({ container, body, request }) => {
      const user = await getSessionUser(request);
      if (!user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }
      return container.todoService.create(user.id, body);
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
    async ({ container, params: { id }, body, request }) => {
      const user = await getSessionUser(request);
      if (!user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }
      return container.todoService.update(id, user.id, body);
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
    async ({ container, params: { id }, request }) => {
      const user = await getSessionUser(request);
      if (!user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }
      await container.todoService.delete(id, user.id);
      return { success: true };
    },
    {
      params: t.Object({ id: t.String() }),
    },
  );

// --- Static file serving + SPA fallback (production only) ---
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let app: Elysia<any, any, any, any, any, any, any>;
if (isProduction) {
  const indexHtml = readFileSync(join(process.cwd(), "app/dist/index.html"));
  app = baseApp
    .use(await staticPlugin({ assets: "app/dist", prefix: "/" }))
    .get("/*", () => new Response(indexHtml, { headers: { "Content-Type": "text/html" } }))
    .listen(3001);
} else {
  app = baseApp.listen(3001);
}

log.info("Server running", { port: app.server?.port });

export type App = typeof baseApp;
