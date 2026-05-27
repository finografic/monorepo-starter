import { initAuthConfig } from '@hono/auth-js';
import { cors } from 'hono/cors';

import { getAuthConfig } from './lib/auth';
import { createApp } from './lib/create-app';

import auth from './routes/auth/auth.route';
import demo from './routes/demo/demo.route';
import health from './routes/health/health.route';
import i18n from './routes/i18n/i18n.route';

const app = createApp();

app.use(
  '/*',
  cors({
    origin: (origin) => origin,
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  }),
);

app.use('*', initAuthConfig(getAuthConfig));

const routes = [health, demo, auth, i18n] as const;

routes.forEach((route) => {
  app.route('/api', route);
});

export default app;
