import type { InferModelFromColumns, SQL } from 'drizzle-orm';

import {
  and,
  desc,
  asc,
  eq,
  isNull,
  count,
  ilike,
  inArray,
  sql,
} from 'drizzle-orm';

import { db } from '#/api/db';
import { collectionItemsTable, collectionsTable } from '#/api/db-tables-schema';
import { sortDirectionOptions } from '#/api/pagination/pagination.constants';
import { getPaginationMetadataQuery } from '#/api/pagination/pagination.query';

import type { CollectionItemsTableColumn } from '../collection-item.types';
import type { GetCollectionDetailsByIdRequestArgsDef } from './get-collection-details-by-id.types';

export const getCollectionDetailsByIdDbQuery = async (
  props: GetCollectionDetailsByIdRequestArgsDef & {
    userId: string;
  },
) => {
  const { collectionId, params, userId } = props;
  const { filters, limit, page, search, sort } = params;

  const sortingField: CollectionItemsTableColumn =
    sort.field && collectionItemsTable.hasOwnProperty(sort.field)
      ? (sort.field as CollectionItemsTableColumn)
      : 'name';

  return db.transaction(async (tx) => {
    const [{ totalRecords }] = await tx
      .select({ totalRecords: count() })
      .from(collectionItemsTable)
      .where(
        and(
          eq(collectionItemsTable.collectionId, collectionId),
          eq(collectionItemsTable.userId, userId),
          isNull(collectionItemsTable.deletedAt),
        ),
      );

    const pagination = getPaginationMetadataQuery({
      currentPage: page,
      pageSize: limit,
      totalRecords,
    });

    const [collection] = await tx
      .select()
      .from(collectionsTable)
      .where(
        and(
          eq(collectionsTable.id, collectionId),
          eq(collectionsTable.userId, userId),
          isNull(collectionsTable.deletedAt),
        ),
      );

    const matchesCollectionIdAndUserIdAndNotDeleted = and(
      eq(collectionItemsTable.collectionId, collectionId),
      eq(collectionItemsTable.userId, userId),
      isNull(collectionItemsTable.deletedAt),
    );

    const [customField1, customField2, customField3] = await Promise.all([
      await tx
        .selectDistinct({
          value: collectionItemsTable.customField1Value,
        })
        .from(collectionItemsTable)
        .where(matchesCollectionIdAndUserIdAndNotDeleted)
        .orderBy(asc(collectionItemsTable.customField1Value)),

      await tx
        .selectDistinct({
          value: collectionItemsTable.customField2Value,
        })
        .from(collectionItemsTable)
        .where(matchesCollectionIdAndUserIdAndNotDeleted)
        .orderBy(asc(collectionItemsTable.customField2Value)),

      await tx
        .selectDistinct({
          value: collectionItemsTable.customField3Value,
        })
        .from(collectionItemsTable)
        .where(matchesCollectionIdAndUserIdAndNotDeleted)
        .orderBy(asc(collectionItemsTable.customField3Value)),
    ]);

    const customField1Values = customField1
      .map(({ value }) => {
        return value;
      })
      .filter(Boolean);

    const customField2Values = customField2
      .map(({ value }) => {
        return value;
      })
      .filter(Boolean);

    const customField3Values = customField3
      .map(({ value }) => {
        return value;
      })
      .filter(Boolean);

    const items = await tx
      .select()
      .from(collectionItemsTable)
      .where(
        and(
          matchesCollectionIdAndUserIdAndNotDeleted,
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
        asc(sql`lower(${collectionItemsTable.name})`),
      );

    return {
      collection,
      customFields: {
        customField1Values,
        customField2Values,
        customField3Values,
      },
      items,
      pagination,
    };
  });
};

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
