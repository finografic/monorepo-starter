import { paths } from '@workspace/config/paths';
import { cancel, confirm, isCancel } from '@clack/prompts';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { env } from 'env.server';
import pc from 'picocolors';

interface TableInfo {
  name: string;
}

async function main() {
  console.log('Connecting to database at:', env.DB_PATH);

  const sqlite = new Database(env.DB_PATH);
  const db = drizzle(sqlite);

  // Get project root path (3 levels up from this file)
  // const projectRoot = path.resolve(__dirname, '../../../..');

  // Check if tables or views exist
  const tables = db.$client
    .prepare(
      `SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_drizzle_%'`,
    )
    .all() as TableInfo[];

  const views = db.$client.prepare(`SELECT name FROM sqlite_master WHERE type = 'view'`).all() as TableInfo[];

  if (tables.length > 0 || views.length > 0) {
    const shouldDrop = await confirm({
      message: pc.yellow('⚠️  Warning: This will drop existing tables and views. Are you sure?'),
      initialValue: false,
    });

    if (isCancel(shouldDrop) || !shouldDrop) {
      cancel('Operation cancelled');
      process.exit(0);
    }

    // Disable foreign key constraints temporarily
    console.log('Disabling foreign key constraints...');
    db.$client.prepare('PRAGMA foreign_keys = OFF').run();

    // Drop views first
    if (views.length > 0) {
      console.log('Dropping existing views...');
      for (const { name } of views) {
        try {
          db.$client.prepare(`DROP VIEW IF EXISTS "${name}"`).run();
          console.log(`✅ Dropped view: ${name}`);
        } catch (err) {
          console.warn(`Warning: Could not drop view "${name}". Skipping.`, err);
        }
      }
    }

    // Then drop tables
    if (tables.length > 0) {
      console.log('Dropping existing tables...');
      for (const { name } of tables) {
        try {
          db.$client.prepare(`DROP TABLE IF EXISTS "${name}"`).run();
          console.log(`✅ Dropped table: ${name}`);
        } catch (err) {
          console.warn(`Warning: Could not drop table "${name}". Skipping.`, err);
        }
      }
    }

    // Re-enable foreign key constraints
    console.log('Re-enabling foreign key constraints...');
    db.$client.prepare('PRAGMA foreign_keys = ON').run();
  }

  // Run migrations
  console.log('Running migrations...');
  migrate(db, {
    migrationsFolder: paths.data.path('migrations'),
  });

  console.log('✅ Migrations completed successfully!');
}

main().catch((error) => {
  console.error('❌ Error resetting database:', error);
  process.exit(1);
});

/*

NOTE: drizzle-kit migrate:
- Is a CLI tool for generating migration files
- Compares your schema with the current state
- Creates new SQL migration files
- Does NOT execute the migrations
- Is what you use to create new migration files when you change your schema

NOTE: (this script) using drizzle-orm's migrator
- Actually executes the SQL migrations on your database
- Applies migrations that haven't been run yet
- Updates the _drizzle_migrations table in your database
- Is what you use to actually update your database schema

NOTE: Typical workflow:
- Make changes to your schema files
- Run pnpm migrate to generate the migration files
- Run pnpm db:migrate to apply those migrations to your database
- The first is for applying changes, the second is for creating them.

*/
