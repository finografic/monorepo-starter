import type { SeedConfig, ViewConfig } from '@finografic/project-scripts/db-setup';

export const seedConfigs: SeedConfig[] = [
  {
    name: 'user',
    description: 'Auth users (admin, demo user)',
  },
  {
    name: 'supported_languages',
    description: 'Supported languages (en-GB, es-ES)',
  },
  {
    name: 'translations_ui',
    description: 'UI translations',
    dependencies: ['supported_languages'],
  },
  {
    name: 'translations_app',
    description: 'App translations',
    dependencies: ['supported_languages'],
  },
  {
    name: 'translations_admin',
    description: 'Admin translations',
    dependencies: ['supported_languages'],
  },
];

export const viewConfigs: ViewConfig[] = [];
