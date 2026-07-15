import { defineConfig } from 'drizzle-kit';

import { configs } from '#/configs';

export default defineConfig({
  casing: 'snake_case',
  dbCredentials: {
    url: configs.dbUrl,
  },
  dialect: 'postgresql',
  out: './migrations',
  schema: './src/api/db-tables-schema.ts',
});
