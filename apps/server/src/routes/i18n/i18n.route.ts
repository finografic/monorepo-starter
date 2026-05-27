import { db } from 'db';
import { describeRoute } from 'hono-openapi';

import { createRouter } from 'lib/create-app';

function buildDomainGroupedResources(
  uiRows: Array<{ key: string; translations: Record<string, string> | null }>,
  appRows: Array<{ key: string; translations: Record<string, string> | null }>,
  adminRows: Array<{ key: string; translations: Record<string, string> | null }>,
  locale: string,
): Record<string, unknown> {
  const result: Record<string, Record<string, unknown>> = {
    ui: {},
    app: {},
    admin: {},
  };

  const processRows = (rows: typeof uiRows, domain: 'ui' | 'app' | 'admin') => {
    for (const row of rows) {
      const value = row.translations?.[locale];
      if (!value) continue;

      const segments = row.key.split('.');
      let current = result[domain] as Record<string, unknown>;

      for (let i = 1; i < segments.length; i++) {
        const segment = segments[i]!;
        if (i === segments.length - 1) {
          current[segment] = value;
        } else {
          current[segment] ??= {};
          current = current[segment] as Record<string, unknown>;
        }
      }
    }
  };

  processRows(uiRows, 'ui');
  processRows(appRows, 'app');
  processRows(adminRows, 'admin');

  return result;
}

const router = createRouter();

// GET /api/i18n/:namespace?lng=en-GB
// Returns all domains grouped under { ui, app, admin } for i18next bulk load
router.get(
  '/i18n/:namespace',
  describeRoute({
    tags: ['i18n'],
    summary: 'Load translation bundle',
    description: 'Returns all active translations grouped by domain for i18next backend.',
    responses: {
      200: { description: 'Translation bundle' },
    },
  }),
  async (c) => {
    const { namespace } = c.req.param();
    const lng = c.req.query('lng') ?? 'en-GB';

    if (namespace !== 'translations') {
      return c.json({}, 200);
    }

    const [uiRows, appRows, adminRows] = await Promise.all([
      db.query.translations_ui.findMany({ where: (f, op) => op.eq(f.isActive, true) }),
      db.query.translations_app.findMany({ where: (f, op) => op.eq(f.isActive, true) }),
      db.query.translations_admin.findMany({ where: (f, op) => op.eq(f.isActive, true) }),
    ]);

    const resources = buildDomainGroupedResources(uiRows, appRows, adminRows, lng);
    return c.json(resources, 200);
  },
);

// GET /api/i18n/translations/:domain?lng=en-GB
// Returns single domain array for CMS editing
router.get(
  '/i18n/translations/:domain',
  describeRoute({
    tags: ['i18n'],
    summary: 'List translations for a domain',
    description: 'Returns all active translation entries for the given domain (ui | app | admin).',
    responses: {
      200: { description: 'Translation rows' },
    },
  }),
  async (c) => {
    const { domain } = c.req.param();

    interface TranslationRow {
      id: string;
      key: string;
      translations: Record<string, string> | null;
      isActive: boolean | number;
    }
    let rows: TranslationRow[] = [];

    switch (domain) {
      case 'ui':
        rows = await db.query.translations_ui.findMany({ where: (f, op) => op.eq(f.isActive, true) });
        break;
      case 'app':
        rows = await db.query.translations_app.findMany({ where: (f, op) => op.eq(f.isActive, true) });
        break;
      case 'admin':
        rows = await db.query.translations_admin.findMany({ where: (f, op) => op.eq(f.isActive, true) });
        break;
      default:
        return c.json([], 200);
    }

    return c.json(rows, 200);
  },
);

export default router;
