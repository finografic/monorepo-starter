import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { env } from 'env.server';
import pc from 'picocolors';

import * as schema from './schemas';

const sqlite = new Database(env.DB_PATH);

if (sqlite.open) {
  console.log(`  ${pc.dim('●')} Database:      ${pc.dim(env.DB_NAME)}`);
} else {
  console.error(`  ${pc.red('●')} Database:      failed to open ${env.DB_NAME}`);
}

export const db = drizzle(sqlite, { schema });
export const sqliteAny = sqlite as any;
