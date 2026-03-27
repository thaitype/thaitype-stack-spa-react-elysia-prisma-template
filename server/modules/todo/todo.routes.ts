import { Elysia, t } from 'elysia'
import { authPlugin } from '../../lib/auth-plugin'
import type { ServiceContainer } from '../../context/app-context'

export function createTodoRoutes(container: ServiceContainer) {
  return new Elysia({ prefix: '/api/todos' })
    .use(authPlugin)
    .get('/', ({ user }) => container.todoService.getAll(user.id), { withAuth: true })
    .get('/:id', ({ user, params: { id } }) => container.todoService.getById(id, user.id), {
      withAuth: true,
      params: t.Object({ id: t.String() }),
    })
    .post('/', ({ user, body }) => container.todoService.create(user.id, body), {
      withAuth: true,
      body: t.Object({
        title: t.String({ minLength: 1 }),
        description: t.Optional(t.String()),
      }),
    })
    .patch('/:id', ({ user, params: { id }, body }) => container.todoService.update(id, user.id, body), {
      withAuth: true,
      params: t.Object({ id: t.String() }),
      body: t.Object({
        title: t.Optional(t.String({ minLength: 1 })),
        description: t.Optional(t.String()),
        completed: t.Optional(t.Boolean()),
      }),
    })
    .delete('/:id', async ({ user, params: { id } }) => {
      await container.todoService.delete(id, user.id)
      return { success: true }
    }, {
      withAuth: true,
      params: t.Object({ id: t.String() }),
    })
}
