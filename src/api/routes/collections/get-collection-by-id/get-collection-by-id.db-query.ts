import { and, eq, isNull } from 'drizzle-orm';

import { db } from '#/api/db';
import { collectionsTable } from '#/api/db-tables-schema';

export const getCollectionByIdDbQuery = async (props: {
  id: number;
  userId: string;
}) => {
  const { id, userId } = props;

  const [collection] = await db
    .select()
    .from(collectionsTable)
    .where(
      and(
        eq(collectionsTable.id, id),
        eq(collectionsTable.userId, userId),
        isNull(collectionsTable.deletedAt),
      ),
    );

  return collection;
};
