import { and, asc, count, desc, eq, ilike, isNull } from 'drizzle-orm';

import type { PaginationQueriesSchemaDef } from '#/api/pagination/pagination.types';

import { db } from '#/api/db';
import { sortDirectionOptions } from '#/api/pagination/pagination.constants';
import { getPaginationMetadataQuery } from '#/api/pagination/pagination.query';

import type { CollectionRecordDef } from '../collection.types';

import { collectionsTable } from '../../../../db-tables-schema';

export const getPaginatedCollectionsDbQuery = async (props: {
  params: PaginationQueriesSchemaDef;
  userId: string;
}) => {
  const { params, userId } = props;
  const { limit, page, search, sort } = params;

  return db.transaction(async (tx) => {
    const [{ totalRecords }] = await tx
      .select({ totalRecords: count() })
      .from(collectionsTable);

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

    const collections = await tx
      .select()
      .from(collectionsTable)
      .where(
        and(
          eq(collectionsTable.userId, userId),
          isNull(collectionsTable.deletedAt),
          search
            ? ilike(collectionsTable.name, `%${search.toLowerCase()}%`)
            : undefined,
        ),
      )
      .limit(limit)
      .offset((page - 1) * limit)
      .orderBy(
        sort?.direction === sortDirectionOptions.desc
          ? desc(collectionsTable[sortingField])
          : asc(collectionsTable[sortingField]),
      );

    return {
      collections,
      pagination,
    };
  });
};
