import { and, eq, isNull } from 'drizzle-orm';

import { db } from '#/api/db';
import {
  collectionsTable,
  collectionsToCustomFieldsTable,
} from '#/api/db-tables-schema';

import type { OnUpdateCollectionsArgsDef } from './update-collection-by-id.types';

export const updateCollectionByIdDbQuery = async ({
  records: recordsToUpdate,
}: OnUpdateCollectionsArgsDef) => {
  if (recordsToUpdate.length === 0) {
    return [];
  }

  const { userId } = recordsToUpdate[0];

  for (const { customFields, ...record } of recordsToUpdate) {
    // const separatedCustomFields = customFields.reduce<{
    //   existing: InsertCustomFieldRecordDef[];
    //   new: CreateCustomFieldsDbQueryRecordDef[];
    // }>(
    //   (acc, { id, ...data }) => {
    //     if (typeof id === 'string') {
    //       acc.new.push({ ...data, collectionId: record.id, userId });
    //     } else {
    //       acc.existing.push({ id, ...data, userId });
    //     }

    //     return acc;
    //   },
    //   {
    //     existing: [],
    //     new: [],
    //   },
    // );

    // if (separatedCustomFields.new.length) {
    //   await createCustomFieldsDbQuery({
    //     records: separatedCustomFields.new,
    //   });
    // }
    // if (separatedCustomFields.existing.length) {
    //   // await updateCustomFieldsDbQuery({
    //   //   records: separatedCustomFields.existing,
    //   // });
    // }

    const existingCustomFieldLinks =
      await db.query.collectionsToCustomFields.findMany({
        where: {
          collectionId: record.id,
          customFieldId: {
            in: customFields.map(({ id }) => {
              return id;
            }),
          },
        },
      });

    await db.delete(collectionsToCustomFieldsTable).where(
      eq(collectionsToCustomFieldsTable.collectionId, record.id),
      // inArray(
      //   collectionsToCustomFieldsTable.customFieldId,
      //   customFields.map(({ id }) => {
      //     return id;
      //   }),
      // ),
    );

    await db.insert(collectionsToCustomFieldsTable).values(
      customFields.map(({ id }) => {
        return { collectionId: record.id, customFieldId: id };
      }),
    );

    await db
      .update(collectionsTable)
      .set(record)
      .where(
        and(
          eq(collectionsTable.id, record.id),
          eq(collectionsTable.userId, record.userId),
          isNull(collectionsTable.deletedAt),
        ),
      );
  }
};
