import fs from 'node:fs';
import path from 'node:path';
import { sql } from 'drizzle-orm';

import { db } from '..';

const scriptDir = import.meta.dirname;

function isValidView(viewName: string): boolean {
  const viewsDir = path.join(scriptDir, '../views');
  const sqlFile = path.join(viewsDir, `${viewName}.sql`);
  return fs.existsSync(sqlFile);
}

function createView(viewName: string): void {
  try {
    if (!isValidView(viewName)) {
      console.error(`❌ Invalid view name: ${viewName}`);

      const viewsDir = path.join(scriptDir, '../views');
      if (fs.existsSync(viewsDir)) {
        const availableViews = fs
          .readdirSync(viewsDir)
          .filter((file) => file.endsWith('.sql'))
          .map((file) => file.replace('.sql', ''));
        console.log(`Available views: ${availableViews.join(', ')}`);
      }
      process.exit(1);
    }

    const sqlFile = path.join(scriptDir, '../views', `${viewName}.sql`);

    if (!fs.existsSync(sqlFile)) {
      console.warn(`⚠️ No SQL file found for view: ${viewName}`);
      console.log(`Expected SQL file at: ${sqlFile}`);
      return;
    }

    const sqlContent = fs.readFileSync(sqlFile, 'utf-8');

    console.log(`🔧 Creating view: ${viewName}...`);

    db.run(sql.raw(`DROP VIEW IF EXISTS ${viewName};`));
    console.log(`  ✓ Dropped existing ${viewName} view (if it existed)`);

    db.run(sql.raw(sqlContent));
    console.log(`  ✅ Created ${viewName} view successfully`);

    const viewData = db.run(sql.raw(`SELECT COUNT(*) as count FROM ${viewName}`));
    console.log(`  ✓ View contains ${JSON.stringify(viewData)} rows`);
  } catch (error) {
    console.error(`❌ Error creating view ${viewName}:`, error);
    throw error;
  }
}

export function createAllViews(): void {
  console.log('🔧 Creating all database views...');

  try {
    const viewsDir = path.join(scriptDir, '../views');
    if (!fs.existsSync(viewsDir)) {
      console.warn('⚠️ Views directory not found');
      return;
    }

    const viewFiles = fs
      .readdirSync(viewsDir)
      .filter((file) => file.endsWith('.sql'))
      .map((file) => file.replace('.sql', ''));

    for (const name of viewFiles) {
      createView(name);
    }

    console.log('✅ All database views created successfully');
  } catch (error) {
    console.error('❌ Error creating database views:', error);
    throw error;
  }
}

const viewName = process.argv[2]?.toLowerCase();

if (viewName === 'all') {
  try {
    createAllViews();
    console.log('🎉 All views created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('💥 View creation failed:', error);
    process.exit(1);
  }
} else if (viewName) {
  try {
    createView(viewName);
    console.log(`🎉 View ${viewName} created successfully!`);
    process.exit(0);
  } catch (error) {
    console.error(`💥 View ${viewName} creation failed:`, error);
    process.exit(1);
  }
} else {
  console.error('❌ No view specified');
  console.log('Usage: node create-view.js <view-name> | all');
  process.exit(1);
}
