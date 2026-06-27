import { getAuthUser } from '@hono/auth-js';
import { db } from 'db';
import { user, userSchemas } from 'db/schemas';
import { eq } from 'drizzle-orm';
import { describeRoute } from 'hono-openapi';
import * as v from 'valibot';

import { requireAuth } from 'lib/require-auth';
import { requireRole } from 'lib/require-role';

import type { AppContext } from 'types/app.types';

export const list = {
  path: '/' as const,
  middleware: describeRoute({
    tags: ['users'],
    summary: 'List all users',
    description: 'Returns all user accounts. Requires admin role.',
    responses: {
      200: { description: 'User list' },
      401: { description: 'Not authenticated' },
      403: { description: 'Not authorised' },
    },
  }),
  handler: async (c: AppContext) => {
    const users = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
      })
      .from(user)
      .orderBy(user.createdAt);

    return c.json(users, 200);
  },
};

export const update = {
  path: '/:id' as const,
  middleware: describeRoute({
    tags: ['users'],
    summary: 'Update a user',
    description: 'Admin can update any field. A user may only update their own name.',
    responses: {
      200: { description: 'Updated user' },
      400: { description: 'Validation error' },
      401: { description: 'Not authenticated' },
      403: { description: 'Not authorised' },
      404: { description: 'User not found' },
    },
  }),
  handler: async (c: AppContext) => {
    const { id } = c.req.param();
    if (!id) return c.json({ error: 'VALIDATION_ERROR', message: 'User id is required' }, 400);

    const authUser = await getAuthUser(c);

    const requestingId = authUser?.session?.user?.id;
    const requestingRole = (authUser?.session?.user as { role?: string } | undefined)?.role ?? 'user';

    const body = await c.req.json<unknown>();
    const parsed = v.safeParse(userSchemas.patch, body);
    if (!parsed.success) return c.json({ error: 'VALIDATION_ERROR', message: 'Invalid data' }, 400);

    const patch = parsed.output;

    if (patch.role !== undefined && requestingRole !== 'admin') {
      return c.json({ error: 'FORBIDDEN', message: 'Only admins can change roles' }, 403);
    }
    if (requestingRole !== 'admin' && requestingId !== id) {
      return c.json({ error: 'FORBIDDEN', message: 'Cannot update another user' }, 403);
    }

    const [updated] = await db
      .update(user)
      .set({ ...patch, updatedAt: new Date() })
      .where(eq(user.id, id))
      .returning();

    if (!updated) return c.json({ error: 'NOT_FOUND', message: 'User not found' }, 404);

    return c.json({ id: updated.id, name: updated.name, email: updated.email, role: updated.role }, 200);
  },
};

export const remove = {
  path: '/:id' as const,
  middleware: describeRoute({
    tags: ['users'],
    summary: 'Delete a user',
    description: 'Permanently removes a user account. Requires admin role.',
    responses: {
      200: { description: 'User deleted' },
      401: { description: 'Not authenticated' },
      403: { description: 'Not authorised' },
      404: { description: 'User not found' },
    },
  }),
  handler: async (c: AppContext) => {
    const { id } = c.req.param();
    if (!id) return c.json({ error: 'VALIDATION_ERROR', message: 'User id is required' }, 400);

    const [deleted] = await db.delete(user).where(eq(user.id, id)).returning({ id: user.id });
    if (!deleted) return c.json({ error: 'NOT_FOUND', message: 'User not found' }, 404);
    return c.json({ success: true }, 200);
  },
};

export const requireAdmin = [requireAuth(), requireRole('admin')] as const;
export const requireUser = requireAuth();
