import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-valibot';
import * as v from 'valibot';

import { sqliteBooleanField } from 'lib/valibot.utils';

export const translations_app = sqliteTable('translations_app', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  key: text('key').notNull().unique(),
  translations: text('translations', { mode: 'json' })
    .$type<Record<string, string>>()
    .notNull()
    .default({ 'en-GB': '' }),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
});

const insertTranslationAppSchema = v.omit(
  createInsertSchema(translations_app, {
    key: v.pipe(v.string(), v.minLength(1), v.maxLength(255)),
    translations: v.record(v.string(), v.string()),
    isActive: sqliteBooleanField(),
  }),
  ['id', 'createdAt', 'updatedAt'],
);

export const translationAppSchemas = {
  select: createSelectSchema(translations_app, {
    translations: v.optional(v.record(v.string(), v.string())),
  }),
  insert: insertTranslationAppSchema,
  patch: v.partial(insertTranslationAppSchema),
} as const;

export type TranslationAppModel = v.InferOutput<typeof translationAppSchemas.select>;
export type TranslationAppInsert = v.InferOutput<typeof translationAppSchemas.insert>;
export type TranslationAppPatch = v.InferOutput<typeof translationAppSchemas.patch>;
