import { db } from '../index';
import { translations_app } from '../schemas';

const data: Array<{ key: string; translations: Record<string, string> }> = [
  { key: 'app.title', translations: { 'en-GB': 'Monorepo Starter', 'es-ES': 'Iniciador de Monorepo' } },
  {
    key: 'app.subtitle',
    translations: {
      'en-GB':
        'A production-shaped TypeScript monorepo with auth, i18n, data access, admin surfaces, and a reusable UI package ready to adapt.',
      'es-ES':
        'Un monorepo TypeScript con autenticación, i18n, acceso a datos, superficies de administración y un paquete de UI reutilizable listo para adaptar.',
    },
  },
  {
    key: 'app.description',
    translations: {
      'en-GB': 'A production-grade monorepo starter with Hono, React, Tailwind 4, and Auth.js.',
      'es-ES': 'Un monorepo listo para producción con Hono, React, Tailwind 4 y Auth.js.',
    },
  },
  { key: 'app.features.eyebrow', translations: { 'en-GB': 'Included foundation', 'es-ES': 'Base incluida' } },
  { key: 'app.features.heading', translations: { 'en-GB': "What's included", 'es-ES': 'Qué incluye' } },
  { key: 'app.features.auth.title', translations: { 'en-GB': 'Auth.js + JWT', 'es-ES': 'Auth.js + JWT' } },
  {
    key: 'app.features.auth.desc',
    translations: {
      'en-GB':
        'Credentials provider with JWT strategy, role-based access control, and secure cookie sessions.',
      'es-ES':
        'Proveedor de credenciales con estrategia JWT, control de acceso por roles y sesiones con cookies seguras.',
    },
  },
  {
    key: 'app.features.i18n.title',
    translations: { 'en-GB': 'DB-backed i18n', 'es-ES': 'i18n respaldado por BD' },
  },
  {
    key: 'app.features.i18n.desc',
    translations: {
      'en-GB': 'Server-side translation tables with en-GB and es-ES, served via i18next HTTP backend.',
      'es-ES': 'Tablas de traducción del servidor con en-GB y es-ES, servidas mediante i18next HTTP backend.',
    },
  },
  {
    key: 'app.features.design.title',
    translations: { 'en-GB': 'shadcn + Tailwind 4', 'es-ES': 'shadcn + Tailwind 4' },
  },
  {
    key: 'app.features.design.desc',
    translations: {
      'en-GB': 'shadcn components with Tailwind 4 tokens, recipes, and owned source components.',
      'es-ES': 'Componentes shadcn con tokens Tailwind 4, recetas y componentes fuente propios.',
    },
  },
  {
    key: 'app.features.stack.title',
    translations: { 'en-GB': 'Modern full-stack app', 'es-ES': 'Aplicación full-stack moderna' },
  },
  {
    key: 'app.features.stack.desc',
    translations: {
      'en-GB': 'Hono + Drizzle ORM on the server. Vite 8 + React 19 + React Router v7 on the client.',
      'es-ES': 'Hono + Drizzle ORM en el servidor. Vite 8 + React 19 + React Router v7 en el cliente.',
    },
  },
  { key: 'app.pages.home.title', translations: { 'en-GB': 'Welcome', 'es-ES': 'Bienvenido' } },
  {
    key: 'app.pages.home.hero',
    translations: { 'en-GB': 'Build fast, ship faster', 'es-ES': 'Construye rápido, entrega más rápido' },
  },
  { key: 'app.pages.home.cta', translations: { 'en-GB': 'Get started', 'es-ES': 'Comenzar' } },
  { key: 'app.pages.home.features', translations: { 'en-GB': 'Features', 'es-ES': 'Características' } },
  { key: 'app.pages.login.title', translations: { 'en-GB': 'Sign in', 'es-ES': 'Iniciar sesión' } },
  {
    key: 'app.pages.login.subtitle',
    translations: { 'en-GB': 'Welcome back', 'es-ES': 'Bienvenido de nuevo' },
  },
  {
    key: 'app.pages.login.cta',
    translations: { 'en-GB': 'Sign in to your account', 'es-ES': 'Acceder a tu cuenta' },
  },
  {
    key: 'app.pages.login.noAccount',
    translations: { 'en-GB': "Don't have an account?", 'es-ES': '¿No tienes una cuenta?' },
  },
  { key: 'app.pages.login.register', translations: { 'en-GB': 'Create account', 'es-ES': 'Crear cuenta' } },
];

export async function seed() {
  console.log('  Seeding translations_app...');

  const existing = await db.select().from(translations_app).limit(1);
  if (existing.length > 0) {
    console.log('  ✓ translations_app already seeded, skipping...');
    return;
  }

  const inserted = await db
    .insert(translations_app)
    .values(data.map((item) => ({ key: item.key, translations: item.translations, isActive: true })))
    .returning();

  console.log(`  ✓ Inserted ${inserted.length} app translation entries`);
}
