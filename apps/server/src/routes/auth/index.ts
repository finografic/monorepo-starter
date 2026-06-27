import { createRouter } from 'lib/create-app';

import * as routes from './auth.routes';

export const authRouter = createRouter()
  .post(routes.signUp.path, routes.signUp.middleware, routes.signUpRateLimit, routes.signUp.handler)
  .post(routes.clearAllCookies.path, routes.clearAllCookies.middleware, routes.clearAllCookies.handler)
  .use('/signin/*', routes.signInRateLimit)
  .use(routes.authJs.path, routes.authJs.handler);
