import type { InferModelFromColumns, SQL } from 'drizzle-orm';

import { and, asc, eq, isNull, ilike, inArray } from 'drizzle-orm';

import { db } from '#/api/db';
import { collectionItemsTable } from '#/api/db-tables-schema';
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
  const { filters, limit, page, search, searchNotes, sort } = params;

  const sortingField: CollectionItemsTableColumn =
    sort.field && collectionItemsTable.hasOwnProperty(sort.field)
      ? (sort.field as CollectionItemsTableColumn)
      : 'name';

  return db.transaction(async (tx) => {
    const totalRecords = await tx.$count(
      collectionItemsTable,
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

    const collection = await tx.query.collections.findFirst({
      where: {
        deletedAt: undefined,
        id: collectionId,
        userId,
      },
      with: {
        customFields: {
          columns: {
            id: true,
            name: true,
            type: true,
          },
          with: {
            customFieldValues: {
              columns: {
                id: true,
                value: true,
              },
            },
          },
        },
      },
    });

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

    const items = await tx.query.collectionItems.findMany({
      limit,
      offset: (page - 1) * limit,
      orderBy: (table, { asc, desc, sql }) => {
        const directionFn =
          sort.direction === sortDirectionOptions.desc ? desc : asc;

        return directionFn(sql`lower(${table[sortingField || 'name']})`);
      },
      where: {
        // TODO - ADD FILTERS BACK IN (LOGIC AT BOTTOM)
        collectionId,
        userId,
      },
      with: {
        customFieldValues: {
          columns: {
            customFieldId: true,
            id: true,
            value: true,
          },
        },
      },
    });

    const formattedItems = items.map(({ customFieldValues, ...item }) => {
      const customFieldValuesByCustomFieldId = customFieldValues.reduce<
        Record<number, { id: number; value: boolean | string | number }>
      >((acc, { customFieldId, ...customFieldValue }) => {
        return { ...acc, [customFieldId]: customFieldValue };
      }, {});

      return {
        ...item,
        customFieldValues: customFieldValuesByCustomFieldId,
      };
    });

    return {
      collection,
      customFields: {
        customField1Values,
        customField2Values,
        customField3Values,
      },
      items: formattedItems,
      pagination,
    };
  });
};

const formatFiltersSql = <
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
  searchNotes: boolean;
  table: TTable;
}): SQL[] => {
  const { filters = {}, search = '', searchNotes, table } = props;

  const getCustomFieldColumnName = (key: string) => {
    const num = Number(key.replace(/\D/g, ''));
    const columnName = `customField${num}Value` as const;

    return columnName;
  };

  const sqlFilters: SQL[] = [];

  Object.entries(filters)
    .filter(([key]) => {
      const columnName = getCustomFieldColumnName(key);
      const isTableColumn = table.hasOwnProperty(columnName);

      return isTableColumn;
    })
    .forEach(([key, value]) => {
      const columnName = getCustomFieldColumnName(key);

      const isArray = Array.isArray(value);

      if (isArray) {
        if (value.length) {
          sqlFilters.push(inArray(table[columnName], value as string[]));
        }
      } else {
        return sqlFilters.push(eq(table[columnName], value as string));
      }
    });

  const cleanSearchTerm = search.trim();

  if (cleanSearchTerm) {
    sqlFilters.push(
      searchNotes
        ? ilike(table.notes, `%${cleanSearchTerm}%`)
        : ilike(table.name, `%${cleanSearchTerm}%`),
    );
  }

  return sqlFilters;
};
