import { createRouter } from 'lib/create-app';

import * as routes from './translations.routes';

export const translationsRouter = createRouter().patch(
  routes.update.path,
  ...routes.requireAdmin,
  routes.update.middleware,
  routes.update.handler,
);
