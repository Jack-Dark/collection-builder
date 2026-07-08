import type { InferModelFromColumns, SQL } from 'drizzle-orm';

import { inArray, and, asc, desc, eq, ilike, isNull } from 'drizzle-orm';

import type { PaginatedData } from '#/api/pagination/types';
import type { CollectionItemsSearchQueriesSchemaDef } from '#/routes/api/collections/$id';

import { db } from '#/api/db';
import { sortDirectionOptions } from '#/api/pagination/constants';
import { getPaginationMetadataQuery } from '#/api/pagination/query';

import type {
  NewCollectionItemRecordDef,
  UpdateCollectionItemRecordDef,
  CollectionItemRecordDef,
} from './types';

import { collectionItemsTable } from '../../../schema';

// TODO - DELETE
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
    eq(collectionItemsTable.userId, userId),
    isNull(collectionItemsTable.deletedAt),
  );
};

type CollectionItemsTableColumn = keyof CollectionItemRecordDef;

const formatFilters = <
  TTable extends InferModelFromColumns<
    {
      customField1Value: any;
      customField2Value: any;
      customField3Value: any;
      name: any;
    } & Record<string, any>
  >,
>(props: {
  filters: {
    customField1: string[];
    customField2: string[];
    customField3: string[];
  };
  search: string | undefined;
  table: TTable;
}): SQL | undefined => {
  const { filters = {}, search = '', table } = props;

  const getCustomFieldColumnName = (key: string) => {
    const num = Number(key.replace(/\D/g, ''));
    const columnName = `customField${num}Value` as const;

    return columnName;
  };

  const filterItems = Object.entries(filters)
    .filter(([key]) => {
      const columnName = getCustomFieldColumnName(key);
      const isTableColumn = table.hasOwnProperty(columnName);

      return isTableColumn;
    })
    .map(([key, value]) => {
      const columnName = getCustomFieldColumnName(key);

      const isArray = Array.isArray(value);

      if (isArray) {
        if (value.length) {
          return inArray(table[columnName], value as string[]);
        }
      } else {
        return eq(table[columnName], value as string);
      }
    });

  const cleanSearchTerm = search.trim();

  return and(
    ...filterItems,
    cleanSearchTerm ? ilike(table.name, `%${cleanSearchTerm}%`) : undefined,
  );
};

export const getItemsByCollectionIdQuery = async (props: {
  collectionId: number;
  params: CollectionItemsSearchQueriesSchemaDef;
  userId: string;
}): Promise<PaginatedData<CollectionItemRecordDef>> => {
  const { collectionId, params, userId } = props;
  const { filters, limit, page, search, sort } = params;

  const metadata = await getPaginationMetadataQuery({
    currentPage: page,
    pageSize: limit,
    table: collectionItemsTable,
  });

  const sortingField: CollectionItemsTableColumn =
    sort.field && collectionItemsTable.hasOwnProperty(sort.field)
      ? (sort.field as CollectionItemsTableColumn)
      : 'name';

  const data = await db
    .select()
    .from(collectionItemsTable)
    .where(
      and(
        getMatchesCollectionIdAndUserIdAndNotDeleted({ collectionId, userId }),
        formatFilters({
          filters,
          search,
          table: collectionItemsTable,
        }),
      ),
    )
    .limit(limit)
    .offset((page - 1) * limit)
    .orderBy(
      sort.direction === sortDirectionOptions.desc
        ? desc(collectionItemsTable[sortingField])
        : asc(collectionItemsTable[sortingField]),
      asc(collectionItemsTable.name),
    );

  return {
    data,
    metadata,
  };
};

export const getCollectionItemByIdQuery = async (props: {
  collectionItemId: number;
  userId: string;
}) => {
  const { collectionItemId, userId } = props;

  const [game] = await db
    .select()
    .from(collectionItemsTable)
    .where(
      and(
        eq(collectionItemsTable.id, collectionItemId),
        getMatchesUserIdAndNotDeleted(userId),
      ),
    );

  return game;
};

export const getLastAddedCollectionItemQuery = async (props: {
  collectionId: number;
  userId: string;
}) => {
  const { collectionId, userId } = props;
  const [lastAddedItem] = await db
    .select()
    .from(collectionItemsTable)
    .where(
      getMatchesCollectionIdAndUserIdAndNotDeleted({ collectionId, userId }),
    )
    .orderBy(desc(collectionItemsTable.createdAt))
    .limit(1);

  return lastAddedItem;
};

export const getCustomFieldsSetsForCollectionIdQuery = async (props: {
  collectionId: number;
  userId: string;
}) => {
  const { collectionId, userId } = props;

  const customFields = await db
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

  const filteredFields = customFields.reduce(
    (acc, { customField1Value, customField2Value, customField3Value }) => {
      if (customField1Value) {
        acc.customField1Values.add(customField1Value);
      }
      if (customField2Value) {
        acc.customField2Values.add(customField2Value);
      }
      if (customField3Value) {
        acc.customField3Values.add(customField3Value);
      }

      return acc;
    },
    {
      customField1Values: new Set<string>(),
      customField2Values: new Set<string>(),
      customField3Values: new Set<string>(),
    },
  );

  return {
    customField1Values: Array.from(filteredFields.customField1Values).sort(),
    customField2Values: Array.from(filteredFields.customField2Values).sort(),
    customField3Values: Array.from(filteredFields.customField3Values).sort(),
  };
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
    .set({ ...props, updatedAt: new Date().toDateString() })
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
    .set({ deletedAt: new Date().toDateString() })
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
