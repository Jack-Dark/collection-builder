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

import { collectionsTable } from '../../../schema';

const getMatchesUserIdAndNotDeleted = (userId: string) => {
  return and(
    eq(collectionsTable.userId, userId),
    isNull(collectionsTable.deletedAt),
  );
};

const getMatchesCollectionIdAndUserIdAndNotDeleted = (props: {
  collectionId: number;
  userId: string;
}) => {
  const { collectionId, userId } = props;

  return and(
    eq(collectionsTable.id, collectionId),
    eq(collectionsTable.userId, userId),
    isNull(collectionsTable.deletedAt),
  );
};

export const getAllCollections = async (props: {
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
          getMatchesUserIdAndNotDeleted(userId),
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

export const getCollectionById = async (props: {
  id: number;
  userId: string;
}) => {
  const { id, userId } = props;

  const [collection] = await db
    .select()
    .from(collectionsTable)
    .where(
      and(eq(collectionsTable.id, id), getMatchesUserIdAndNotDeleted(userId)),
    );

  return collection;
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

export const createCollection = async (data: NewCollectionRecordDef) => {
  const [newCollection] = await db
    .insert(collectionsTable)
    .values(data)
    .onConflictDoNothing()
    .returning();

  return newCollection;
};

export const updateCollection = async (data: UpdateCollectionRecordDef) => {
  const { userId } = data;
  // TODO - MAY HAVE TO MERGE OLD AND NEW DATA. GET COLLECTION BY ID, IF NEEDED
  const [record] = await db
    .update(collectionsTable)
    .set({ ...data, updatedAt: new Date().toDateString() })
    .where(
      and(
        eq(collectionsTable.id, data.id),
        getMatchesUserIdAndNotDeleted(userId),
      ),
    )
    .returning();

  return record;
};

export const deleteCollection = async (props: {
  id: number;
  userId: string;
}) => {
  const { id, userId } = props;

  await db
    .delete(collectionsTable)
    .where(
      and(eq(collectionsTable.id, id), getMatchesUserIdAndNotDeleted(userId)),
    );
};
