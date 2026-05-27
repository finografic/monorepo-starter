import { db } from 'db';
import {
  translationAdminSchemas,
  translationAppSchemas,
  translationUiSchemas,
  translations_admin,
  translations_app,
  translations_ui,
} from 'db/schemas';
import { eq } from 'drizzle-orm';
import * as v from 'valibot';

import { createRouter } from 'lib/create-app';
import { requireAuth } from 'lib/require-auth';
import { requireRole } from 'lib/require-role';

const router = createRouter();

// sqliteBooleanField() normalises to 0|1; Drizzle .set() expects boolean
function normalisePatch(patch: {
  isActive?: 0 | 1 | undefined;
  key?: string | undefined;
  translations?: Record<string, string> | undefined;
}) {
  const { isActive, ...rest } = patch;
  return {
    ...rest,
    updatedAt: new Date(),
    ...(isActive !== undefined ? { isActive: isActive === 1 } : {}),
  };
}

// ======================================================
// PATCH /api/translations/:domain/:id — admin, update
// translation entry (key, translations map, isActive)
// ======================================================

router.patch('/translations/:domain/:id', requireAuth(), requireRole('admin'), async (c) => {
  const { domain, id } = c.req.param();
  const body = await c.req.json<unknown>();

  switch (domain) {
    case 'ui': {
      const parsed = v.safeParse(translationUiSchemas.patch, body);
      if (!parsed.success) return c.json({ error: 'Invalid data' }, 400);
      const [updated] = await db
        .update(translations_ui)
        .set(normalisePatch(parsed.output))
        .where(eq(translations_ui.id, id))
        .returning();
      if (!updated) return c.json({ error: 'Not found' }, 404);
      return c.json(updated, 200);
    }
    case 'app': {
      const parsed = v.safeParse(translationAppSchemas.patch, body);
      if (!parsed.success) return c.json({ error: 'Invalid data' }, 400);
      const [updated] = await db
        .update(translations_app)
        .set(normalisePatch(parsed.output))
        .where(eq(translations_app.id, id))
        .returning();
      if (!updated) return c.json({ error: 'Not found' }, 404);
      return c.json(updated, 200);
    }
    case 'admin': {
      const parsed = v.safeParse(translationAdminSchemas.patch, body);
      if (!parsed.success) return c.json({ error: 'Invalid data' }, 400);
      const [updated] = await db
        .update(translations_admin)
        .set(normalisePatch(parsed.output))
        .where(eq(translations_admin.id, id))
        .returning();
      if (!updated) return c.json({ error: 'Not found' }, 404);
      return c.json(updated, 200);
    }
    default:
      return c.json({ error: `Unknown domain: ${domain}` }, 400);
  }
});

export default router;
