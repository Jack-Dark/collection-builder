import type { NeonQueryFunction } from '@neondatabase/serverless';

import { neon } from '@neondatabase/serverless';
import { configs } from '#/configs.ts';
import { drizzle } from 'drizzle-orm/node-postgres';

import * as schema from './schema.ts';

export const db = drizzle({
  casing: 'snake_case',
  connection: configs.dbUrl,
  schema,
});

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
