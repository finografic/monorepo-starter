import { sValidator } from '@hono/standard-validator';

import { createRouter } from 'lib/create-app';

import type { AppContext } from 'types/app.types';

import * as routes from './auth.routes';

const validationHook = (result: { success: boolean }, c: AppContext) => {
  if (!result.success) {
    return c.json({ error: 'VALIDATION_ERROR', message: 'Invalid data' }, 400);
  }
};

export const authRouter = createRouter()
  .post(
    routes.signUp.path,
    routes.signUp.middleware,
    routes.signUpRateLimit,
    sValidator('json', routes.signUp.schema, validationHook),
    routes.signUp.handler,
  )
  .post(routes.clearAllCookies.path, routes.clearAllCookies.middleware, routes.clearAllCookies.handler)
  .use('/signin/*', routes.signInRateLimit)
  .use(routes.authJs.path, routes.authJs.handler);
