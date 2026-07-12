import { and, asc, eq, isNull } from 'drizzle-orm';

import { db } from '#/api/db';

import { collectionsTable } from '../../../db-tables-schema';

export const getNavMenuCollectionsDbQuery = async (props: {
  userId: string;
}) => {
  const { userId } = props;

  const collections = await db
    .select({ id: collectionsTable.id, name: collectionsTable.name })
    .from(collectionsTable)
    .where(
      and(
        eq(collectionsTable.userId, userId),
        isNull(collectionsTable.deletedAt),
      ),
    )
    .orderBy(asc(collectionsTable.name));

  return { collections };
};
