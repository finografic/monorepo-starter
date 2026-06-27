import { createRouter } from 'lib/create-app';

import * as routes from './health.routes';

export const healthRouter = createRouter().get(
  routes.health.path,
  routes.health.middleware,
  routes.health.handler,
);
