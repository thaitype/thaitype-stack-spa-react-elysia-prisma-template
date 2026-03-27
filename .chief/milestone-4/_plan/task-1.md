# Task 1: Set up Eden Treaty client and React Query provider

## Objective

Install Eden and React Query, create the Eden treaty client using the server's exported App type, wrap the app in QueryClientProvider.

## Scope

**Included:**
- Install `@elysiajs/eden`, `@tanstack/react-query`
- `app/lib/eden.ts` — Eden treaty client using `App` type from server
- `app/lib/query-client.ts` — QueryClient instance with defaults
- Update `app/routes/__root.tsx` — wrap with QueryClientProvider

**Excluded:**
- Refactoring components (task-2)

## Key Details

The server already exports `export type App = typeof baseApp` in `server/index.ts`.

Eden Treaty client setup:
```ts
import { treaty } from '@elysiajs/eden'
import type { App } from '../../server/index'

export const api = treaty<App>('', { fetch: { credentials: 'include' } })
```

Note: empty string base URL since Vite proxy handles routing to backend.

## Steps

1. `bun add @elysiajs/eden @tanstack/react-query`
2. Create `app/lib/eden.ts` — treaty client with credentials
3. Create `app/lib/query-client.ts` — QueryClient with sensible defaults (staleTime, retry)
4. Update `app/routes/__root.tsx`:
   - Import QueryClientProvider and queryClient
   - Wrap Outlet in QueryClientProvider

## Acceptance Criteria

- Eden client created and typed against App
- QueryClientProvider wraps all routes
- No runtime errors on page load

## Verification

```bash
bunx tsc --noEmit
```
