import { and, eq } from 'drizzle-orm';

import { db } from '#/api/db';
import {
  collectionItemsToCustomFieldValuesTable,
  customFieldValuesTable,
} from '#/api/db-tables-schema';

import type { DeleteCustomFieldValuesDbQueryArgsDef } from './delete-custom-field-values.types';

export const deleteCustomFieldValuesDbQuery = async ({
  collectionItemId,
  ids,
  userId,
}: DeleteCustomFieldValuesDbQueryArgsDef) => {
  return db.transaction(async (tx) => {
    await Promise.all(
      ids.map(async (customFieldValueId) => {
        // ? get the number of links between all collection items and this custom field value
        const numMatchingLinks = await tx.$count(
          collectionItemsToCustomFieldValuesTable,
          and(
            eq(
              collectionItemsToCustomFieldValuesTable.customFieldValueId,
              customFieldValueId,
            ),
            eq(collectionItemsToCustomFieldValuesTable.userId, userId),
          ),
        );

        if (numMatchingLinks > 1) {
          // ? delete only the link record that matches the collectionItemId
          return db
            .delete(customFieldValuesTable)
            .where(
              and(
                eq(
                  collectionItemsToCustomFieldValuesTable.collectionItemId,
                  collectionItemId,
                ),
                eq(
                  collectionItemsToCustomFieldValuesTable.customFieldValueId,
                  customFieldValueId,
                ),
                eq(collectionItemsToCustomFieldValuesTable.userId, userId),
              ),
            );
        } else {
          // ? delete the custom field value record
          return db
            .delete(customFieldValuesTable)
            .where(
              and(
                eq(customFieldValuesTable.id, customFieldValueId),
                eq(customFieldValuesTable.userId, userId),
              ),
            );
        }
      }),
    );
  });
};
