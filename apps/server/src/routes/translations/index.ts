import { sValidator } from '@hono/standard-validator';

import { createRouter } from 'lib/create-app';

import type { AppContext } from 'types/app.types';

import * as routes from './translations.routes';

const validationHook = (result: { success: boolean }, c: AppContext) => {
  if (!result.success) {
    return c.json({ error: 'VALIDATION_ERROR', message: 'Invalid data' }, 400);
  }
};

export const translationsRouter = createRouter().patch(
  routes.update.path,
  ...routes.requireAdmin,
  routes.update.middleware,
  sValidator('json', routes.update.schema, validationHook),
  routes.update.handler,
);
