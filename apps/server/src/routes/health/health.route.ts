import { describeRoute } from 'hono-openapi';

import { createRouter } from '../../lib/create-app';

const router = createRouter();

router.get(
  '/health',
  describeRoute({
    tags: ['health'],
    summary: 'Health check',
    description: 'Returns 200 OK when the server is running.',
    responses: {
      200: { description: 'Server is healthy' },
    },
  }),
  (c) => {
    return c.json({ status: 'ok', timestamp: new Date().toISOString() });
  },
);

export default router;
