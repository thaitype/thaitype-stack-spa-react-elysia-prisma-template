# Task 1: Install prismabox, add generator, generate schemas

## Objective

Add prismabox generator to Prisma schema, generate TypeBox schemas for all models.

## Steps

1. `bun add prismabox`
2. Add prismabox generator to `prisma/schema.prisma`:
   ```prisma
   generator prismabox {
     provider                    = "prismabox"
     typeboxImportDependencyName = "elysia"
     typeboxImportVariableName   = "t"
     inputModel                  = true
     output                      = "../generated/prismabox"
   }
   ```
3. Run `bunx prisma generate` — generates TypeBox schemas under `generated/prismabox/`
4. Verify generated files exist: `generated/prismabox/Todo.ts`, `generated/prismabox/User.ts`, etc.

## Expected Generated Output (Todo.ts)

```ts
// TodoPlain — full model schema
// TodoPlainInputCreate — fields needed for create
// TodoPlainInputUpdate — fields for update (all optional)
```

## Acceptance Criteria

- prismabox generator in schema.prisma
- `generated/prismabox/` contains TypeBox schemas for all models
- `bunx tsc --noEmit` passes

## Verification

```bash
bunx prisma generate
bunx tsc --noEmit
```
