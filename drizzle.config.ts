import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dbCredentials: {
    url: import.meta.env.DATABASE_URL,
  },
  dialect: 'postgresql',
  out: './migrations',
  schema: './src/api/db-tables-schema.ts',
});
