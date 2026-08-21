import { defineConfig } from 'drizzle-kit';

import { configs } from '#/configs';

export default defineConfig({
  dbCredentials: {
    url: configs.dbUrl,
  },
  dialect: 'postgresql',
  out: './migrations',
  schema: './src/api/db-tables-schema.ts',
});
