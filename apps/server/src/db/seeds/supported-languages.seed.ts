import { db } from '../index';
import { supported_languages } from '../schemas';

export async function seed() {
  console.log('  Seeding supported_languages...');

  const existing = await db.select().from(supported_languages).limit(1);
  if (existing.length > 0) {
    console.log('  ✓ supported_languages already seeded, skipping...');
    return;
  }

  const inserted = await db
    .insert(supported_languages)
    .values([
      {
        isoCode: 'en-GB',
        nativeName: 'English',
        displayName: 'English (United Kingdom)',
        flagCode: 'GB',
        isActive: true,
        isDefault: true,
        sortOrder: 1,
      },
      {
        isoCode: 'es-ES',
        nativeName: 'Español',
        displayName: 'Spanish (Spain)',
        flagCode: 'ES',
        isActive: true,
        isDefault: false,
        sortOrder: 2,
      },
    ])
    .returning();

  console.log(`  ✓ Inserted ${inserted.length} languages`);
}
