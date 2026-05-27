import { getAuthUser } from '@hono/auth-js';
import { db } from 'db';
import { user, userSchemas } from 'db/schemas';
import { eq } from 'drizzle-orm';
import * as v from 'valibot';

import { createRouter } from 'lib/create-app';
import { requireAuth } from 'lib/require-auth';
import { requireRole } from 'lib/require-role';

const router = createRouter();

// ======================================================
// GET /api/users — admin-only, full user list
// ======================================================

router.get('/users', requireAuth(), requireRole('admin'), async (c) => {
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
});

// ======================================================
// PATCH /api/users/:id — admin updates any field;
// user can only update their own name
// ======================================================

router.patch('/users/:id', requireAuth(), async (c) => {
  const { id } = c.req.param();
  const authUser = await getAuthUser(c);

  const requestingId = authUser?.session?.user?.id;
  const requestingRole = (authUser?.session?.user as { role?: string } | undefined)?.role ?? 'user';

  const body = await c.req.json<unknown>();
  const parsed = v.safeParse(userSchemas.patch, body);
  if (!parsed.success) return c.json({ error: 'Invalid data' }, 400);

  const patch = parsed.output;

  if (patch.role !== undefined && requestingRole !== 'admin') {
    return c.json({ error: 'Forbidden' }, 403);
  }
  if (requestingRole !== 'admin' && requestingId !== id) {
    return c.json({ error: 'Forbidden' }, 403);
  }

  const [updated] = await db
    .update(user)
    .set({ ...patch, updatedAt: new Date() })
    .where(eq(user.id, id))
    .returning();

  if (!updated) return c.json({ error: 'Not found' }, 404);

  return c.json({ id: updated.id, name: updated.name, email: updated.email, role: updated.role }, 200);
});

// ======================================================
// DELETE /api/users/:id — admin-only
// ======================================================

router.delete('/users/:id', requireAuth(), requireRole('admin'), async (c) => {
  const { id } = c.req.param();
  const [deleted] = await db.delete(user).where(eq(user.id, id)).returning({ id: user.id });
  if (!deleted) return c.json({ error: 'Not found' }, 404);
  return c.json({ success: true }, 200);
});

export default router;
