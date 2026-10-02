import { and, count, eq, ilike, isNull } from 'drizzle-orm';

import type { PaginationQueriesSchemaDef } from '#/api/pagination/pagination.types';

import { db } from '#/api/db';
import { getPaginationMetadataQuery } from '#/api/pagination/pagination.query';

import type { CollectionRecordDef } from '../collection.types';

import { collectionsTable } from '../../../db-tables-schema';

export const getPaginatedCollectionsDbQuery = async (props: {
  params: PaginationQueriesSchemaDef;
  userId: string;
}) => {
  throw new Error('FETCH ERROR TEST');
  const { params, userId } = props;
  const { limit, page, search, sort } = params;

  return db.transaction(async (tx) => {
    const matchesUserAndSearch = and(
      eq(collectionsTable.userId, userId),
      isNull(collectionsTable.deletedAt),
      search
        ? ilike(collectionsTable.name, `%${search.toLowerCase()}%`)
        : undefined,
    );
    const [{ totalRecords }] = await tx
      .select({ totalRecords: count() })
      .from(collectionsTable)
      .where(matchesUserAndSearch);

    const pagination = getPaginationMetadataQuery({
      currentPage: page,
      pageSize: limit,
      totalRecords,
    });

    const sortFieldParam = sort?.field;
    const sortingField =
      sortFieldParam && collectionsTable.hasOwnProperty(sortFieldParam)
        ? (sortFieldParam as keyof CollectionRecordDef)
        : 'name';

    const collections = await tx.query.collections.findMany({
      limit,
      offset: (page - 1) * limit,
      orderBy: {
        [sortingField]: sort?.direction || 'asc',
      },
      where: {
        deletedAt: undefined,
        name: {
          like: `%${search.toLowerCase()}%`,
        },
        userId,
      },
      with: {
        customFields: {
          columns: {
            id: true,
            name: true,
            type: true,
          },
          orderBy: {
            name: 'asc',
          },
        },
      },
    });

    return {
      collections,
      pagination,
    };
  });
};
