import { defineRelations } from 'drizzle-orm';

import * as schema from '../db-tables-schema';

/** Maps to new keys for clarity. */
const x = {
  original: 'from',
  references: 'to',
} as const;

export const relations = defineRelations(
  {
    accounts: schema.accountsTable,
    collectionItems: schema.collectionItemsTable,
    collections: schema.collectionsTable,
    sessions: schema.sessionsTable,
    times: schema.timestamps,
    users: schema.usersTable,
    verifications: schema.verificationsTable,
  },
  (r) => {
    return {
      collections: {
        a_collection_item: r.many.collectionItems({
          [x.original]: r.collections.id,
          [x.references]: r.collectionItems.collectionId,
        }),
      },
      users: {
        a_accounts: r.one.accounts({
          [x.original]: r.users.id,
          [x.references]: r.accounts.userId,
        }),
        a_collection_items: r.many.collectionItems({
          [x.original]: r.users.id,
          [x.references]: r.collectionItems.userId,
        }),
        a_collections: r.many.collections({
          [x.original]: r.users.id,
          [x.references]: r.collections.userId,
        }),
        a_sessions: r.many.sessions({
          [x.original]: r.users.id,
          [x.references]: r.sessions.userId,
        }),
      },
    };
  },
);
