import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-valibot';
import * as v from 'valibot';

export const user = sqliteTable('auth_user', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: integer('emailVerified', { mode: 'boolean' }).notNull().default(false),
  image: text('image'),
  hashedPassword: text('hashedPassword'),
  role: text('role', { enum: ['public', 'user', 'admin'] })
    .notNull()
    .default('user'),
  createdAt: integer('createdAt', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer('updatedAt', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
});

const insertUserSchema = v.omit(createInsertSchema(user), [
  'id',
  'emailVerified',
  'hashedPassword',
  'createdAt',
  'updatedAt',
]);

export const userSchemas = {
  select: createSelectSchema(user),
  patch: v.partial(insertUserSchema),
} as const;

export type UserModel = v.InferOutput<typeof userSchemas.select>;
export type UserPatch = v.InferOutput<typeof userSchemas.patch>;
