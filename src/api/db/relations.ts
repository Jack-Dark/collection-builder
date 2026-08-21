import { defineRelations } from 'drizzle-orm';

import * as schema from '../db-tables-schema';

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
      accounts: {
        user: r.one.users({
          from: r.accounts.userId,
          to: r.users.id,
        }),
      },
      collections: {
        user: r.one.users({
          alias: 'collections_userId_users_id',
          from: r.collections.userId,
          to: r.users.id,
        }),
        users: r.many.users({
          alias: 'collections_id_users_id_via_collectionItems',
          from: r.collections.id.through(r.collectionItems.collectionId),
          to: r.users.id.through(r.collectionItems.userId),
        }),
      },
      sessions: {
        user: r.one.users({
          from: r.sessions.userId,
          to: r.users.id,
        }),
      },
      users: {
        accounts: r.many.accounts(),
        collectionsUserId: r.many.collections({
          alias: 'collections_userId_users_id',
        }),
        collectionsViaCollectionItems: r.many.collections({
          alias: 'collections_id_users_id_via_collectionItems',
        }),
        sessions: r.many.sessions(),
      },
    };
  },
);
