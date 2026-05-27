import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-valibot';
import * as v from 'valibot';

import { sqliteBooleanField } from 'lib/valibot.utils';

export const translations_ui = sqliteTable('translations_ui', {
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

const insertTranslationUiSchema = v.omit(
  createInsertSchema(translations_ui, {
    key: v.pipe(v.string(), v.minLength(1), v.maxLength(255)),
    translations: v.record(v.string(), v.string()),
    isActive: sqliteBooleanField(),
  }),
  ['id', 'createdAt', 'updatedAt'],
);

export const translationUiSchemas = {
  select: createSelectSchema(translations_ui, {
    translations: v.optional(v.record(v.string(), v.string())),
  }),
  insert: insertTranslationUiSchema,
  patch: v.partial(insertTranslationUiSchema),
} as const;

export type TranslationUiModel = v.InferOutput<typeof translationUiSchemas.select>;
export type TranslationUiInsert = v.InferOutput<typeof translationUiSchemas.insert>;
export type TranslationUiPatch = v.InferOutput<typeof translationUiSchemas.patch>;
