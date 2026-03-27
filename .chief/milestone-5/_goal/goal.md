# Goal

Refactor to domain-centric (module) architecture for both backend and frontend.

- Backend: `server/modules/todo/` groups routes, service, repository
- Frontend: `app/features/todo/` groups components and hooks
- Extract auth macro into reusable plugin
- Extract todo routes into module
- Keep `server/index.ts` as pure composition root
