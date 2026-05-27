import { getAuthUser } from '@hono/auth-js';
import type { Session } from './auth';
import type { MiddlewareHandler } from 'hono';

type Role = Session['user']['role'];

const ROLE_ORDER: Role[] = ['public', 'user', 'admin'];

export function requireRole(minimum: 'user' | 'admin'): MiddlewareHandler {
  return async (c, next) => {
    const authUser = await getAuthUser(c);
    if (!authUser?.session?.user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    const role = (authUser.session.user as unknown as Session['user']).role ?? 'public';
    if (ROLE_ORDER.indexOf(role) < ROLE_ORDER.indexOf(minimum)) {
      return c.json({ error: 'Forbidden' }, 403);
    }
    await next();
  };
}
