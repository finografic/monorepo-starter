import { sValidator } from '@hono/standard-validator';

import { createRouter } from 'lib/create-app';

import type { AppContext } from 'types/app.types';

import * as routes from './users.routes';

const validationHook = (result: { success: boolean }, c: AppContext) => {
  if (!result.success) {
    return c.json({ error: 'VALIDATION_ERROR', message: 'Invalid data' }, 400);
  }
};

export const usersRouter = createRouter()
  .get(routes.list.path, ...routes.requireAdmin, routes.list.middleware, routes.list.handler)
  .patch(
    routes.update.path,
    routes.requireUser,
    routes.update.middleware,
    sValidator('json', routes.update.schema, validationHook),
    routes.update.handler,
  )
  .delete(routes.remove.path, ...routes.requireAdmin, routes.remove.middleware, routes.remove.handler);
