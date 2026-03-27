import { Elysia, t } from "elysia";
import { staticPlugin } from "@elysiajs/static";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { authPlugin } from "./lib/auth-plugin";
import { createContainer } from "./context/app-context";

const isProduction = process.env.NODE_ENV === "production";

// --- Composition Root: wire all dependencies via container ---
const container = createContainer();
const log = container.appContext.logger;

const baseApp = new Elysia()
  .onError(({ error, code }) => {
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

  // --- Better Auth handler + auth macro ---
  .use(authPlugin)

  // --- Todo routes (session-protected via { withAuth: true }) ---
  .get("/api/todos", ({ container, user }) => {
    return container.todoService.getAll(user.id);
  }, { withAuth: true })

  .get(
    "/api/todos/:id",
    ({ container, params: { id }, user }) => {
      return container.todoService.getById(id, user.id);
    },
    {
      withAuth: true,
      params: t.Object({ id: t.String() }),
    },
  )

  .post(
    "/api/todos",
    ({ container, body, user }) => {
      return container.todoService.create(user.id, body);
    },
    {
      withAuth: true,
      body: t.Object({
        title: t.String({ minLength: 1 }),
        description: t.Optional(t.String()),
      }),
    },
  )

  .patch(
    "/api/todos/:id",
    ({ container, params: { id }, body, user }) => {
      return container.todoService.update(id, user.id, body);
    },
    {
      withAuth: true,
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
    async ({ container, params: { id }, user }) => {
      await container.todoService.delete(id, user.id);
      return { success: true };
    },
    {
      withAuth: true,
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
