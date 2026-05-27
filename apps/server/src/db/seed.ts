import pc from 'picocolors';

import { hashPassword } from '../utils/password.utils';
import { db } from './index';
import { user } from './schemas';
import { seed as seedSupportedLanguages } from './seeds/supported-languages.seed';
import { seed as seedTranslationsAdmin } from './seeds/translations-admin.seed';
import { seed as seedTranslationsApp } from './seeds/translations-app.seed';
import { seed as seedTranslationsUi } from './seeds/translations-ui.seed';

async function seedUsers(): Promise<void> {
  console.log('  Seeding users...');

  const existing = await db.select().from(user).limit(1);
  if (existing.length > 0) {
    console.log('  ✓ users already seeded, skipping...');
    return;
  }

  const usersToCreate = [
    { email: 'admin@example.com', password: 'admin1234', name: 'Admin User', role: 'admin' as const },
    { email: 'user@example.com', password: 'user1234', name: 'Demo User', role: 'user' as const },
  ];

  for (const userData of usersToCreate) {
    const hashedPw = await hashPassword(userData.password);
    const now = new Date();

    await db.insert(user).values({
      name: userData.name,
      email: userData.email,
      hashedPassword: hashedPw,
      emailVerified: false,
      role: userData.role,
      createdAt: now,
      updatedAt: now,
    });

    console.log(`  ✓ Created ${userData.role}: ${userData.email}`);
  }
}

async function main(): Promise<void> {
  console.log('');
  console.log(pc.bold('Seeding database…'));
  console.log('');

  await seedUsers();
  await seedSupportedLanguages();
  await seedTranslationsUi();
  await seedTranslationsApp();
  await seedTranslationsAdmin();

  console.log('');
  console.log(pc.green('✅ Seed complete'));
  console.log('');
}

main().catch((err) => {
  console.error(pc.red('Seed failed:'), err);
  process.exit(1);
});
