import { createRouter } from 'lib/create-app';

import * as routes from './i18n.routes';

export const i18nRouter = createRouter()
  .get(routes.bundle.path, routes.bundle.middleware, routes.bundle.handler)
  .get(
    routes.domainTranslations.path,
    routes.domainTranslations.middleware,
    routes.domainTranslations.handler,
  );
