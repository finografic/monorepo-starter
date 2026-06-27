import { describeRoute } from 'hono-openapi';

import type { AppContext } from 'types/app.types';

export const health = {
  path: '/' as const,
  middleware: describeRoute({
    tags: ['health'],
    summary: 'Health check',
    description: 'Returns 200 OK when the server is running.',
    responses: {
      200: { description: 'Server is healthy' },
    },
  }),
  handler: (c: AppContext) => {
    return c.json({ status: 'ok', timestamp: new Date().toISOString() });
  },
};
