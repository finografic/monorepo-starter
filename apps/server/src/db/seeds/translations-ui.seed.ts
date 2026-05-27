import { db } from '../index';
import { translations_ui } from '../schemas';

const data: Array<{ key: string; translations: Record<string, string> }> = [
  { key: 'ui.buttons.save', translations: { 'en-GB': 'Save', 'es-ES': 'Guardar' } },
  { key: 'ui.buttons.cancel', translations: { 'en-GB': 'Cancel', 'es-ES': 'Cancelar' } },
  { key: 'ui.buttons.create', translations: { 'en-GB': 'Create', 'es-ES': 'Crear' } },
  { key: 'ui.buttons.edit', translations: { 'en-GB': 'Edit', 'es-ES': 'Editar' } },
  { key: 'ui.buttons.delete', translations: { 'en-GB': 'Delete', 'es-ES': 'Eliminar' } },
  { key: 'ui.buttons.back', translations: { 'en-GB': 'Back', 'es-ES': 'Volver' } },
  { key: 'ui.buttons.submit', translations: { 'en-GB': 'Submit', 'es-ES': 'Enviar' } },
  { key: 'ui.common.loading', translations: { 'en-GB': 'Loading…', 'es-ES': 'Cargando…' } },
  { key: 'ui.common.error', translations: { 'en-GB': 'An error occurred', 'es-ES': 'Se produjo un error' } },
  { key: 'ui.common.success', translations: { 'en-GB': 'Success', 'es-ES': 'Éxito' } },
  { key: 'ui.common.notFound', translations: { 'en-GB': 'Not found', 'es-ES': 'No encontrado' } },
  { key: 'ui.common.required', translations: { 'en-GB': 'Required', 'es-ES': 'Obligatorio' } },
  { key: 'ui.nav.home', translations: { 'en-GB': 'Home', 'es-ES': 'Inicio' } },
  { key: 'ui.nav.admin', translations: { 'en-GB': 'Admin', 'es-ES': 'Administración' } },
  { key: 'ui.nav.login', translations: { 'en-GB': 'Login', 'es-ES': 'Iniciar sesión' } },
  { key: 'ui.nav.logout', translations: { 'en-GB': 'Logout', 'es-ES': 'Cerrar sesión' } },
  { key: 'ui.nav.settings', translations: { 'en-GB': 'Settings', 'es-ES': 'Configuración' } },
  { key: 'ui.table.noResults', translations: { 'en-GB': 'No results found', 'es-ES': 'Sin resultados' } },
  { key: 'ui.table.actions', translations: { 'en-GB': 'Actions', 'es-ES': 'Acciones' } },
  { key: 'ui.form.email', translations: { 'en-GB': 'Email', 'es-ES': 'Correo electrónico' } },
  { key: 'ui.form.password', translations: { 'en-GB': 'Password', 'es-ES': 'Contraseña' } },
  { key: 'ui.form.name', translations: { 'en-GB': 'Name', 'es-ES': 'Nombre' } },
];

export async function seed() {
  console.log('  Seeding translations_ui...');

  const existing = await db.select().from(translations_ui).limit(1);
  if (existing.length > 0) {
    console.log('  ✓ translations_ui already seeded, skipping...');
    return;
  }

  const inserted = await db
    .insert(translations_ui)
    .values(data.map((item) => ({ key: item.key, translations: item.translations, isActive: true })))
    .returning();

  console.log(`  ✓ Inserted ${inserted.length} UI translation entries`);
}
