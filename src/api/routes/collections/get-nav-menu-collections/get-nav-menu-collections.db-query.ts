import { and, asc, eq, isNull, sql } from 'drizzle-orm';

import type { DbQueryArgsDef } from '#/auth/auth-middleware.types';

import { db } from '#/api/db';

import type { GetNavMenuCollectionsRequestArgsDef } from './get-nav-menu-collections.types';

import { collectionsTable } from '../../../db-tables-schema';

export const getNavMenuCollectionsDbQuery = async ({
  context,
}: DbQueryArgsDef<GetNavMenuCollectionsRequestArgsDef>) => {
  const userId = context.user.id;

  const collections = await db
    .select({ id: collectionsTable.id, name: collectionsTable.name })
    .from(collectionsTable)
    .where(
      and(
        eq(collectionsTable.userId, userId),
        isNull(collectionsTable.deletedAt),
      ),
    )
    .orderBy(asc(sql`lower(${collectionsTable.name})`));

  return { collections };
};
