import { and, eq, isNull } from 'drizzle-orm';

import { db } from '#/api/db';
import { collectionItemsTable } from '#/api/db-tables-schema';

import type { UpdateCollectionItemByIdRequestArgsDef } from './update-collection-item-by-id.types';

export const updateCollectionItemDbQuery = async (
  props: UpdateCollectionItemByIdRequestArgsDef,
) => {
  const { id: collectionItemId, userId } = props;

  return await db.transaction(async (tx) => {
    const [record] = await tx
      .update(collectionItemsTable)
      .set(props)
      .where(
        and(
          eq(collectionItemsTable.id, collectionItemId),
          eq(collectionItemsTable.userId, userId),
          isNull(collectionItemsTable.deletedAt),
        ),
      )
      .returning();

    return record;
  });
};
