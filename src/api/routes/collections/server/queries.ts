import { and, asc, count, desc, eq, ilike, isNull } from 'drizzle-orm';

import type { PaginationQueriesSchemaDef } from '#/api/pagination/pagination.types';

import { db } from '#/api/db';
import { sortDirectionOptions } from '#/api/pagination/pagination.constants';
import { getPaginationMetadataQuery } from '#/api/pagination/pagination.query';

import type {
  NewCollectionRecordDef,
  UpdateCollectionRecordDef,
  CollectionRecordDef,
} from './types';

import { collectionsTable } from '../../../db-tables-schema';

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

export const createCollectionDbQuery = async (data: NewCollectionRecordDef) => {
  const [newCollection] = await db
    .insert(collectionsTable)
    .values(data)
    .onConflictDoNothing()
    .returning();

  return newCollection;
};

export const updateCollectionDbQuery = async (
  data: UpdateCollectionRecordDef,
) => {
  const { userId } = data;
  // TODO - MAY HAVE TO MERGE OLD AND NEW DATA. GET COLLECTION BY ID, IF NEEDED
  const [record] = await db
    .update(collectionsTable)
    .set({ ...data, updatedAt: new Date().toDateString() })
    .where(
      and(
        eq(collectionsTable.id, data.id),
        eq(collectionsTable.userId, userId),
        isNull(collectionsTable.deletedAt),
      ),
    )
    .returning();

  return record;
};

export const deleteCollectionDbQuery = async (props: {
  id: number;
  userId: string;
}) => {
  const { id, userId } = props;

  await db
    .delete(collectionsTable)
    .where(
      and(
        eq(collectionsTable.id, id),
        eq(collectionsTable.userId, userId),
        isNull(collectionsTable.deletedAt),
      ),
    );
};
