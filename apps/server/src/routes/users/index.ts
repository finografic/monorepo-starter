import { createRouter } from 'lib/create-app';

import * as routes from './users.routes';

export const usersRouter = createRouter()
  .get(routes.list.path, ...routes.requireAdmin, routes.list.middleware, routes.list.handler)
  .patch(routes.update.path, routes.requireUser, routes.update.middleware, routes.update.handler)
  .delete(routes.remove.path, ...routes.requireAdmin, routes.remove.middleware, routes.remove.handler);
