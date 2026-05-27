import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-valibot';
import * as v from 'valibot';

import { sqliteBooleanField } from 'lib/valibot.utils';

export const supported_languages = sqliteTable('supported_languages', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  isoCode: text('iso_code').notNull().unique(),
  nativeName: text('native_name').notNull(),
  displayName: text('display_name').notNull(),
  flagCode: text('flag_code'),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  isDefault: integer('is_default', { mode: 'boolean' }).notNull().default(false),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
});

const insertSupportedLanguageSchema = v.omit(
  createInsertSchema(supported_languages, {
    isoCode: v.pipe(v.string(), v.minLength(2), v.maxLength(10)),
    nativeName: v.pipe(v.string(), v.minLength(1), v.maxLength(50)),
    displayName: v.pipe(v.string(), v.minLength(1), v.maxLength(50)),
    flagCode: v.optional(v.pipe(v.string(), v.minLength(2), v.maxLength(5))),
    sortOrder: v.pipe(v.number(), v.integer(), v.minValue(0), v.maxValue(999)),
    isActive: sqliteBooleanField(),
    isDefault: sqliteBooleanField(),
  }),
  ['id', 'createdAt', 'updatedAt'],
);

export const supportedLanguageSchemas = {
  select: createSelectSchema(supported_languages),
  insert: insertSupportedLanguageSchema,
  patch: v.partial(insertSupportedLanguageSchema),
} as const;

export type SupportedLanguageModel = v.InferOutput<typeof supportedLanguageSchemas.select>;
export type SupportedLanguageInsert = v.InferOutput<typeof supportedLanguageSchemas.insert>;
export type SupportedLanguagePatch = v.InferOutput<typeof supportedLanguageSchemas.patch>;
