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
  NewCollectionItemRecordDef,
  UpdateCollectionItemRecordDef,
  CollectionItemRecordDef,
} from './types';

import { collectionItemsTable } from '../../../schema';

const getMatchesUserIdAndNotDeleted = (userId: string | undefined) => {
  return and(
    eq(collectionItemsTable.userId, userId!),
    isNull(collectionItemsTable.deletedAt),
  );
};

const defaultParams = {
  limit: 100,
  page: 1,
} satisfies PaginationParamsSchemaDef<never>;

type CollectionItemsTableColumns = keyof CollectionItemRecordDef;

export const getAllCollectionItemsQuery = async (props: {
  params?: PaginationParamsSchemaDef<keyof CollectionItemRecordDef>;
  userId: string | undefined;
}): Promise<PaginatedData<CollectionItemRecordDef>> => {
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
      table: collectionItemsTable,
    });

    const sortingField: CollectionItemsTableColumns =
      sortField && collectionItemsTable.hasOwnProperty(sortField)
        ? sortField
        : 'name';

    const data = await db
      .select()
      .from(collectionItemsTable)
      .where(
        and(
          getMatchesUserIdAndNotDeleted(userId),
          search
            ? ilike(collectionItemsTable.name, `%${search.toLowerCase()}%`)
            : undefined,
        ),
      )
      .limit(limit)
      .offset((page - 1) * limit)
      .orderBy(
        sortDirection === sortDirectionOptions.desc
          ? desc(collectionItemsTable[sortingField])
          : asc(collectionItemsTable[sortingField]),
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

export const getCollectionItemByIdQuery = async (props: {
  id: number;
  userId: string | undefined;
}) => {
  const { id, userId } = props;
  if (userId) {
    const [game] = await db
      .select()
      .from(collectionItemsTable)
      .where(
        and(
          eq(collectionItemsTable.id, id),
          getMatchesUserIdAndNotDeleted(userId),
        ),
      );

    return game;
  }
};

export const getItemsByCollectionIdQuery = async (props: {
  collectionId: number;
  userId: string | undefined;
}) => {
  const { collectionId, userId } = props;
  if (userId) {
    const items = await db
      .select()
      .from(collectionItemsTable)
      .where(
        and(
          eq(collectionItemsTable.collectionId, collectionId),
          getMatchesUserIdAndNotDeleted(userId),
        ),
      );

    return items;
  }
};

export const getLastAddedCollectionItemSystemQuery = async (
  userId: string | undefined,
) => {
  if (userId) {
    const [game] = await db
      .select({ system: collectionItemsTable.system })
      .from(collectionItemsTable)
      .where(getMatchesUserIdAndNotDeleted(userId))
      .orderBy(desc(collectionItemsTable.createdAt))
      .limit(1);

    return game?.system;
  }
};

export const createCollectionItemQuery = async (
  gameDetails: NewCollectionItemRecordDef,
) => {
  const [newRecord] = await db
    .insert(collectionItemsTable)
    .values(gameDetails)
    .onConflictDoNothing()
    .returning();

  return newRecord;
};

export const updateCollectionItemQuery = async (
  props: UpdateCollectionItemRecordDef,
) => {
  const { userId } = props;
  // TODO - MAY HAVE TO MERGE OLD AND NEW DATA. GET GAME BY ID, IF NEEDED
  const [updatedRecord] = await db
    .update(collectionItemsTable)
    .set({ ...props, updatedAt: new Date() })
    .where(
      and(
        eq(collectionItemsTable.id, props.id),
        getMatchesUserIdAndNotDeleted(userId),
      ),
    )
    .returning();

  return updatedRecord;
};

export const softDeleteCollectionItemByIdQuery = async (props: {
  id: number;
  userId: string | undefined;
}) => {
  const { id, userId } = props;

  await db
    .update(collectionItemsTable)
    .set({ deletedAt: new Date() })
    .where(
      and(
        eq(collectionItemsTable.id, id),
        getMatchesUserIdAndNotDeleted(userId),
      ),
    );
};

export const hardDeleteCollectionItemByIdQuery = async (props: {
  id: number;
  userId: string | undefined;
}) => {
  const { id, userId } = props;

  await db
    .delete(collectionItemsTable)
    .where(
      and(
        eq(collectionItemsTable.id, id),
        getMatchesUserIdAndNotDeleted(userId),
      ),
    );
};

export const hardDeleteAllCollectionItemsByUserQuery = async (
  userId: string,
) => {
  await db
    .delete(collectionItemsTable)
    .where(getMatchesUserIdAndNotDeleted(userId));
};
