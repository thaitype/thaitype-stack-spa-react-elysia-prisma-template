import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";

const app = new Elysia()
  .use(cors({
    origin: "http://localhost:3000",
    credentials: true,
  }))
  .get("/api/health", () => ({ status: "ok" }))
  .listen(3001);

console.log(`Server running at http://localhost:${app.server?.port}`);

export type App = typeof app;
