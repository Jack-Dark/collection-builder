import type { InsertLinkCollectionsToCustomFieldsRecordDef } from '#/api/db-tables-schema.types';
import type { DbQueryArgsDef } from '#/auth/auth-middleware.types';

import { db } from '#/api/db';
import {
  collectionsTable,
  collectionsToCustomFieldsTable,
} from '#/api/db-tables-schema';

import type { CreateCollectionRequestArgsDef } from './create-collection.types';

export const createCollectionDbQuery = async ({
  context,
  data,
}: DbQueryArgsDef<CreateCollectionRequestArgsDef>) => {
  const { records } = data;

  if (!records || records.length === 0) {
    return [];
  }

  const userId = context.user.id;

  await db.transaction(async (tx) => {
    for (const { customFields, ...record } of records) {
      // ? Create new collection records
      const [newCollectionRecord] = await tx
        .insert(collectionsTable)
        .values({ ...record, userId })
        .onConflictDoNothing()
        .returning();

      // ? Create brand new links between this collection and custom fields
      const newCollectionToCustomFieldRecords = customFields.reduce<
        InsertLinkCollectionsToCustomFieldsRecordDef[]
      >((acc, { customField, order }) => {
        return [
          ...acc,
          {
            collectionId: newCollectionRecord.id,
            customFieldId: customField.id,
            order,
            userId,
          },
        ];
      }, []);

      if (newCollectionToCustomFieldRecords.length) {
        await tx
          .insert(collectionsToCustomFieldsTable)
          .values(newCollectionToCustomFieldRecords);
      }
    }
  });
};
