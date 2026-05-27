import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-valibot';
import * as v from 'valibot';

import { sqliteBooleanField } from 'lib/valibot.utils';

export const translations_admin = sqliteTable('translations_admin', {
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

const insertTranslationAdminSchema = v.omit(
  createInsertSchema(translations_admin, {
    key: v.pipe(v.string(), v.minLength(1), v.maxLength(255)),
    translations: v.record(v.string(), v.string()),
    isActive: sqliteBooleanField(),
  }),
  ['id', 'createdAt', 'updatedAt'],
);

export const translationAdminSchemas = {
  select: createSelectSchema(translations_admin, {
    translations: v.optional(v.record(v.string(), v.string())),
  }),
  insert: insertTranslationAdminSchema,
  patch: v.partial(insertTranslationAdminSchema),
} as const;

export type TranslationAdminModel = v.InferOutput<typeof translationAdminSchemas.select>;
export type TranslationAdminInsert = v.InferOutput<typeof translationAdminSchemas.insert>;
export type TranslationAdminPatch = v.InferOutput<typeof translationAdminSchemas.patch>;
