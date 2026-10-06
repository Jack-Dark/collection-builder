import { defineRelations } from 'drizzle-orm';

import * as schema from '../db-tables-schema';

/** Maps to new keys for clarity. */
const x = {
  original: 'from',
  references: 'to',
} as const;

// ? keys prefixed with `a_` are aliases
export const relations = defineRelations(
  {
    accounts: schema.accountsTable,
    collectionItems: schema.collectionItemsTable,
    collectionItemsToCustomFieldValues:
      schema.collectionItemsToCustomFieldValuesTable,
    collections: schema.collectionsTable,
    collectionsToCustomFields: schema.collectionsToCustomFieldsTable,
    customFields: schema.customFieldsTable,
    customFieldValues: schema.customFieldValuesTable,
    sessions: schema.sessionsTable,
    times: schema.timestamps,
    users: schema.usersTable,
    verifications: schema.verificationsTable,
  },
  (r) => {
    return {
      collectionItems: {
        customFieldValues: r.many.customFieldValues({
          [x.original]: r.collectionItems.id.through(
            r.collectionItemsToCustomFieldValues.collectionItemId,
          ),
          [x.references]: r.customFieldValues.id.through(
            r.collectionItemsToCustomFieldValues.customFieldValueId,
          ),
        }),
      },
      collections: {
        collectionItems: r.many.collectionItems({
          [x.original]: r.collections.id,
          [x.references]: r.collectionItems.collectionId,
        }),
        customFields: r.many.customFields({
          [x.original]: r.collections.id.through(
            r.collectionsToCustomFields.collectionId,
          ),
          [x.references]: r.customFields.id.through(
            r.collectionsToCustomFields.customFieldId,
          ),
        }),
      },
      customFields: {
        customFieldValues: r.many.customFieldValues({
          [x.original]: r.customFields.id,
          [x.references]: r.customFieldValues.customFieldId,
        }),
        details: r.one.collectionsToCustomFields({
          [x.original]: r.customFields.id,
          [x.references]: r.collectionsToCustomFields.customFieldId,
        }),
      },
      users: {
        accounts: r.one.accounts({
          [x.original]: r.users.id,
          [x.references]: r.accounts.userId,
        }),
        collectionItems: r.many.collectionItems({
          [x.original]: r.users.id,
          [x.references]: r.collectionItems.userId,
        }),
        collections: r.many.collections({
          [x.original]: r.users.id,
          [x.references]: r.collections.userId,
        }),
        customFields: r.many.customFields({
          [x.original]: r.users.id,
          [x.references]: r.customFields.userId,
        }),
        customFieldValues: r.many.customFieldValues({
          [x.original]: r.users.id,
          [x.references]: r.customFieldValues.userId,
        }),
        sessions: r.many.sessions({
          [x.original]: r.users.id,
          [x.references]: r.sessions.userId,
        }),
      },
    };
  },
);
