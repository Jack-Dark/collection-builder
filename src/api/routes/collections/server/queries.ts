import type {
  PaginatedData,
  PaginationParamsSchemaDef,
} from '#/api/pagination/types';

import { db } from '#/api/db';
import {
  getPaginationMetadataDefaults,
  sortDirectionOptions,
} from '#/api/pagination/constants';
import { getPaginationMetadataQuery } from '#/api/pagination/query';
import { and, asc, desc, eq, ilike, isNull } from 'drizzle-orm';

import type {
  NewCollectionRecordDef,
  UpdateCollectionRecordDef,
  CollectionRecordDef,
} from './types';

import { collectionsTable } from '../../../schema';

const getMatchesUserIdAndNotDeleted = (userId: string | undefined) => {
  return and(
    eq(collectionsTable.userId, userId!),
    isNull(collectionsTable.deletedAt),
  );
};

const defaultParams = {
  limit: 100,
  page: 1,
} satisfies PaginationParamsSchemaDef<never>;

type CollectionsTableColumns = keyof CollectionRecordDef;

export const getAllCollections = async (props: {
  params?: PaginationParamsSchemaDef<keyof CollectionRecordDef>;
  userId: string | undefined;
}): Promise<PaginatedData<CollectionRecordDef>> => {
  const { params = {}, userId } = props;
  const {
    limit = defaultParams.limit,
    page = defaultParams.page,
    search,
    sortDirection = sortDirectionOptions.asc,
    sortField = 'name',
  } = params;

  if (userId) {
    const metadata = await getPaginationMetadataQuery({
      currentPage: page,
      pageSize: limit,
      table: collectionsTable,
    });

    const sortingField: CollectionsTableColumns =
      sortField && collectionsTable.hasOwnProperty(sortField)
        ? sortField
        : 'name';

    const data = await db
      .select()
      .from(collectionsTable)
      .where(
        and(
          getMatchesUserIdAndNotDeleted(userId),
          search
            ? ilike(collectionsTable.name, `%${search.toLowerCase()}%`)
            : undefined,
        ),
      )
      .limit(limit)
      .offset((page - 1) * limit)
      .orderBy(
        sortDirection === sortDirectionOptions.desc
          ? desc(collectionsTable[sortingField])
          : asc(collectionsTable[sortingField]),
      );

    return {
      data,
      metadata,
    };
  }

  return {
    data: [],
    metadata: getPaginationMetadataDefaults(limit),
  };
};

export const getCollectionById = async (props: {
  id: number;
  userId: string | undefined;
}) => {
  const { id, userId } = props;
  if (userId) {
    const [game] = await db
      .select()
      .from(collectionsTable)
      .where(
        and(eq(collectionsTable.id, id), getMatchesUserIdAndNotDeleted(userId)),
      );

    return game;
  }
};

export const createCollection = async (data: NewCollectionRecordDef) => {
  const [newCollection] = await db
    .insert(collectionsTable)
    .values(data)
    .onConflictDoNothing()
    .returning();

  return newCollection;
};

export const updateCollection = async (props: {
  data: UpdateCollectionRecordDef;
  userId: string | undefined;
}) => {
  const { data, userId } = props;
  // TODO - PROBABLY HAVE TO MERGE OLD AND NEW DATA. GET COLLECTION BY ID, IF NEEDED
  const [record] = await db
    .update(collectionsTable)
    .set({ ...data, updatedAt: new Date() })
    .where(
      and(
        eq(collectionsTable.id, data.id),
        getMatchesUserIdAndNotDeleted(userId),
      ),
    )
    .returning();

  return record;
};

export const softDeleteCollection = async (props: {
  id: number;
  userId: string | undefined;
}) => {
  const { id, userId } = props;

  await db
    .update(collectionsTable)
    .set({ deletedAt: new Date() })
    .where(
      and(eq(collectionsTable.id, id), getMatchesUserIdAndNotDeleted(userId)),
    );
};

export const hardDeleteCollection = async (props: {
  id: number;
  userId: string | undefined;
}) => {
  const { id, userId } = props;

  await db
    .delete(collectionsTable)
    .where(
      and(eq(collectionsTable.id, id), getMatchesUserIdAndNotDeleted(userId)),
    );
};

export const hardDeleteAllCollectionsByUser = async (userId: string) => {
  await db
    .delete(collectionsTable)
    .where(getMatchesUserIdAndNotDeleted(userId));
};
