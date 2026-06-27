import { createRouter } from 'lib/create-app';

export const indexRouter = createRouter().get('/', (c) =>
  c.json({ name: '@workspace/server', version: '0.0.1', status: 'ok' }),
);
