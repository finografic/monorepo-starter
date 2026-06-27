import { db } from '../index';
import { translations_admin } from '../schemas';

const data: Array<{ key: string; translations: Record<string, string> }> = [
  { key: 'admin.title', translations: { 'en-GB': 'Admin Panel', 'es-ES': 'Panel de administración' } },
  {
    key: 'admin.subtitle',
    translations: { 'en-GB': 'Manage your application', 'es-ES': 'Gestiona tu aplicación' },
  },
  { key: 'admin.nav.dashboard', translations: { 'en-GB': 'Dashboard', 'es-ES': 'Panel principal' } },
  { key: 'admin.nav.users', translations: { 'en-GB': 'Users', 'es-ES': 'Usuarios' } },
  { key: 'admin.nav.translations', translations: { 'en-GB': 'Translations', 'es-ES': 'Traducciones' } },
  { key: 'admin.nav.settings', translations: { 'en-GB': 'Settings', 'es-ES': 'Configuración' } },
  { key: 'admin.pages.dashboard.title', translations: { 'en-GB': 'Dashboard', 'es-ES': 'Panel principal' } },
  {
    key: 'admin.pages.dashboard.welcome',
    translations: { 'en-GB': 'Welcome to the admin panel', 'es-ES': 'Bienvenido al panel de administración' },
  },
  { key: 'admin.pages.users.title', translations: { 'en-GB': 'Users', 'es-ES': 'Usuarios' } },
  { key: 'admin.pages.users.create', translations: { 'en-GB': 'New user', 'es-ES': 'Nuevo usuario' } },
  { key: 'admin.pages.users.role', translations: { 'en-GB': 'Role', 'es-ES': 'Rol' } },
  { key: 'admin.pages.users.roles.admin', translations: { 'en-GB': 'Admin', 'es-ES': 'Administrador' } },
  { key: 'admin.pages.users.roles.user', translations: { 'en-GB': 'User', 'es-ES': 'Usuario' } },
  {
    key: 'admin.pages.translations.title',
    translations: { 'en-GB': 'Translations', 'es-ES': 'Traducciones' },
  },
  { key: 'admin.pages.translations.domain.ui', translations: { 'en-GB': 'UI', 'es-ES': 'Interfaz' } },
  {
    key: 'admin.pages.translations.domain.app',
    translations: { 'en-GB': 'Application', 'es-ES': 'Aplicación' },
  },
  {
    key: 'admin.pages.translations.domain.admin',
    translations: { 'en-GB': 'Admin', 'es-ES': 'Administración' },
  },
  { key: 'admin.pages.settings.title', translations: { 'en-GB': 'Settings', 'es-ES': 'Configuración' } },
  { key: 'admin.pages.settings.language', translations: { 'en-GB': 'Language', 'es-ES': 'Idioma' } },
];

export async function seed() {
  console.log('  Seeding translations_admin...');

  const existing = await db.select().from(translations_admin).limit(1);
  if (existing.length > 0) {
    console.log('  ✓ translations_admin already seeded, skipping...');
    return;
  }

  const inserted = await db
    .insert(translations_admin)
    .values(data.map((item) => ({ key: item.key, translations: item.translations, isActive: true })))
    .returning();

  console.log(`  ✓ Inserted ${inserted.length} admin translation entries`);
}
