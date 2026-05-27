import { hashPassword } from '../utils/password.utils';
import { db } from './index';
import { user } from './schemas';

async function seed(): Promise<void> {
  console.log('Seeding users...');

  const existing = await db.select().from(user).limit(1);
  if (existing.length > 0) {
    console.log('✓ User table already seeded, skipping...');
    return;
  }

  const usersToCreate = [
    { email: 'admin@example.com', password: 'admin123', name: 'Admin User', role: 'admin' as const },
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

  console.log('✅ Seed complete');
}

seed().catch(console.error);
