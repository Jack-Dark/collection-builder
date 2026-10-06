import { and, eq } from 'drizzle-orm';

import { db } from '#/api/db';
import { collectionItemsToCustomFieldValuesTable } from '#/api/db-tables-schema';

import type { GetCollectionItemsWithCustomFieldValueDbQueryArgsDef } from './get-collection-items-with-custom-field-value.types';

export const getCollectionItemsWithCustomFieldValueDbQuery = async (
  props: GetCollectionItemsWithCustomFieldValueDbQueryArgsDef,
) => {
  const { id: customFieldValueId, userId } = props;

  return db.transaction(async (tx) => {
    const numCollectionItemsWithCustomFieldValue: number = await tx.$count(
      collectionItemsToCustomFieldValuesTable,
      and(
        eq(
          collectionItemsToCustomFieldValuesTable.customFieldValueId,
          customFieldValueId,
        ),
        eq(collectionItemsToCustomFieldValuesTable.userId, userId),
      ),
    );

    const collectionsWithCustomFieldId = await tx.query.collections.findMany({
      columns: {
        id: true,
        name: true,
      },
      where: {
        customFields: {
          customFieldValues: {
            id: customFieldValueId,
          },
        },
        userId,
      },
    });

    return {
      affectedCollections: collectionsWithCustomFieldId,
      numAffectedCollectionItems: numCollectionItemsWithCustomFieldValue,
    };
  });
};
