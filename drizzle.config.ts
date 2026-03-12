import { configs } from '#/configs';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  casing: 'snake_case',
  dbCredentials: {
    url: configs.dbUrl,
  },
  dialect: 'postgresql',
  schema: './src/db/schema.ts',
  out: './migrations',
});
