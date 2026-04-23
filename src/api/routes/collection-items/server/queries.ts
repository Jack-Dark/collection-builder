import { and, asc, desc, eq, ilike, isNull } from 'drizzle-orm';

import type {
  PaginatedData,
  PaginationParamsSchemaDef,
} from '#/api/pagination/types';

import { db } from '#/api/db';
import { sortDirectionOptions } from '#/api/pagination/constants';
import { getPaginationMetadataQuery } from '#/api/pagination/query';

import type {
  NewCollectionItemRecordDef,
  UpdateCollectionItemRecordDef,
  CollectionItemRecordDef,
} from './types';

import { collectionItemsTable, collectionsTable } from '../../../schema';

const getMatchesUserIdAndNotDeleted = (userId: string) => {
  return and(
    eq(collectionItemsTable.userId, userId),
    isNull(collectionItemsTable.deletedAt),
  );
};

const getMatchesCollectionIdAndUserIdAndNotDeleted = (props: {
  collectionId: number;
  userId: string;
}) => {
  const { collectionId, userId } = props;

  return and(
    eq(collectionItemsTable.collectionId, collectionId),
    getMatchesUserIdAndNotDeleted(userId),
  );
};

const defaultParams = {
  limit: 100,
  page: 1,
} satisfies PaginationParamsSchemaDef<never>;

type CollectionItemsTableColumns = keyof CollectionItemRecordDef;

export const getAllCollectionItemsQuery = async (props: {
  collectionId: number;
  params?: PaginationParamsSchemaDef<keyof CollectionItemRecordDef>;
  userId: string;
}): Promise<PaginatedData<CollectionItemRecordDef>> => {
  const { collectionId, params = {}, userId } = props;
  const {
    limit = defaultParams.limit,
    page = defaultParams.page,
    search,
    sortDirection = sortDirectionOptions.asc,
    sortField = 'name',
  } = params;

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
        getMatchesCollectionIdAndUserIdAndNotDeleted({ collectionId, userId }),
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
};

export const getCollectionItemByIdQuery = async (props: {
  id: number;
  userId: string;
}) => {
  const { id, userId } = props;

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
};

export const getItemsByCollectionIdQuery = async (props: {
  collectionId: number;
  userId: string;
}) => {
  const { collectionId, userId } = props;

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
};

export const getCustomFieldsForCollectionIdQuery = async (props: {
  collectionId: number;
  userId: string;
}) => {
  const { collectionId, userId } = props;

  const [record] = await db
    .select({
      customField1Enabled: collectionsTable.customField1Enabled,
      customField1Label: collectionsTable.customField1Label,
      customField2Enabled: collectionsTable.customField2Enabled,
      customField2Label: collectionsTable.customField2Label,
      customField3Enabled: collectionsTable.customField3Enabled,
      customField3Label: collectionsTable.customField3Label,
    })
    .from(collectionsTable)
    .where(
      getMatchesCollectionIdAndUserIdAndNotDeleted({ collectionId, userId }),
    )
    .limit(1);

  return record;
};

export const getCustomFieldsSetsForCollectionIdQuery = async (props: {
  collectionId: number;
  userId: string;
}) => {
  const { collectionId, userId } = props;

  const foo = await db
    .selectDistinct({
      customField1Value: collectionItemsTable.customField1Value,
      customField2Value: collectionItemsTable.customField2Value,
      customField3Value: collectionItemsTable.customField3Value,
    })
    .from(collectionItemsTable)
    .where(
      and(
        getMatchesCollectionIdAndUserIdAndNotDeleted({ collectionId, userId }),
        eq(collectionItemsTable.collectionId, collectionId),
      ),
    );

  console.log('🚀 ~ getCustomFieldsSetsForCollectionIdQuery ~ foo:', foo);

  return foo;
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
  userId: string;
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
  userId: string;
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
