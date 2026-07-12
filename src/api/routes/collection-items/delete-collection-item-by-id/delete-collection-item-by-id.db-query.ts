import { and, eq, isNull } from 'drizzle-orm';

import { db } from '#/api/db';
import { collectionItemsTable } from '#/api/db-tables-schema';

export const deleteCollectionItemByIdDbQuery = async (props: {
  id: number;
  userId: string;
}) => {
  const { id, userId } = props;

  await db
    .delete(collectionItemsTable)
    .where(
      and(
        eq(collectionItemsTable.id, id),
        eq(collectionItemsTable.userId, userId),
        isNull(collectionItemsTable.deletedAt),
      ),
    );
};
