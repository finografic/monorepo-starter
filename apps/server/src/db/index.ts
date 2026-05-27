import path from 'node:path';
import { paths } from '@workspace/config/paths';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import pc from 'picocolors';

import * as schema from './schemas';

const dbName = process.env.DB_NAME || 'development.sqlite.db';
const dbPath = process.env.DB_PATH || path.resolve(paths.data.dir, dbName);

const sqlite = new Database(dbPath);

if (sqlite.open) {
  console.log(`  ${pc.dim('●')} Database:      ${pc.dim(dbName)}`);
}

export const db = drizzle(sqlite, { schema });
export { schema };
