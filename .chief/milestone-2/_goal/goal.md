# Goal

Production-ready setup:
- Remove CORS, use Vite proxy for all dev traffic (single origin)
- Run frontend + backend concurrently with one `bun run dev` command
- Elysia serves built frontend static files in production
- Dockerfile for production deployment
