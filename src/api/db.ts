import type { NeonQueryFunction } from '@neondatabase/serverless';

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/node-postgres';

import { configs } from '#/configs.ts';

import * as schema from './schema.ts';

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
    account: schema.accountsTable,
    session: schema.sessionsTable,
    user: schema.usersTable,
    verification: schema.verificationsTable,
  },
  sql: getClient(),
});
