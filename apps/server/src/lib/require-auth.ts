import { verifyAuth } from '@hono/auth-js';
import type { MiddlewareHandler } from 'hono';

export function requireAuth(): MiddlewareHandler {
  return verifyAuth();
}
