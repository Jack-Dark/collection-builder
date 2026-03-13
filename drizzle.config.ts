import { configs } from '#/configs';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  casing: 'snake_case',
  dbCredentials: {
    url: configs.dbUrl,
  },
  dialect: 'postgresql',
  out: './migrations',
  schema: './src/api/schema.ts',
});
