import type { NeonQueryFunction } from '@neondatabase/serverless';

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/node-postgres';

import { configs } from '#/configs.ts';

import * as dbTablesSchema from './db-tables-schema.ts';

let client: NeonQueryFunction<boolean, boolean> | undefined;

export async function getClient() {
  if (!configs.dbUrl) {
    return undefined;
  }

  if (!client) {
    client = await neon(configs.dbUrl);
  }

  return client;
}

export const db = drizzle({
  casing: 'snake_case',
  connection: configs.dbUrl,
  schema: {
    account: dbTablesSchema.accountsTable,
    session: dbTablesSchema.sessionsTable,
    user: dbTablesSchema.usersTable,
    verification: dbTablesSchema.verificationsTable,
  },
  sql: getClient(),
});
