# Task 1: Add pino logger with ILogger interface

## Objective

Install pino + pino-pretty, create an ILogger interface, implement PinoLogger, and create a logger factory.

## Scope

**Included:**
- Install `pino` and `pino-pretty` (dev)
- `server/infrastructure/logging/logger.interface.ts` — ILogger interface
- `server/infrastructure/logging/pino-logger.ts` — PinoLogger class implementing ILogger
- `server/infrastructure/logging/logger-factory.ts` — `createLogger()` factory function

**Excluded:**
- Wiring into services (task-2)

## Steps

1. `bun add pino` and `bun add -d pino-pretty @types/pino`
2. Create `server/infrastructure/logging/logger.interface.ts`:
   ```ts
   export interface ILogger {
     info(message: string, metadata?: Record<string, unknown>): void
     warn(message: string, metadata?: Record<string, unknown>): void
     error(message: string, metadata?: Record<string, unknown>): void
     debug(message: string, metadata?: Record<string, unknown>): void
   }
   ```
3. Create `server/infrastructure/logging/pino-logger.ts`:
   - PinoLogger implements ILogger
   - Constructor takes `{ level, environment }`
   - Dev: use pino-pretty transport with colorize
   - Production: structured JSON
   - Test: silent
4. Create `server/infrastructure/logging/logger-factory.ts`:
   - `createLogger(config)` returns ILogger
   - Auto-detect level from NODE_ENV if not specified
5. Create `server/infrastructure/logging/index.ts` barrel export

## Acceptance Criteria

- ILogger interface defined
- PinoLogger works with pino-pretty in dev, JSON in prod
- Factory function creates logger with sensible defaults

## Verification

```bash
bunx tsc --noEmit
```
