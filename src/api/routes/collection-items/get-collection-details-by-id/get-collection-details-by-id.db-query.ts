import type { InferModelFromColumns, SQL } from 'drizzle-orm';

import { and, eq, isNull, ilike, inArray } from 'drizzle-orm';

import { db } from '#/api/db';
import { collectionItemsTable } from '#/api/db-tables-schema';
import { sortDirectionOptions } from '#/api/pagination/pagination.constants';
import { getPaginationMetadataQuery } from '#/api/pagination/pagination.query';

import type { CustomFieldValuesByFieldId } from '../../custom-field-values/custom-field-values.types';
import type { CollectionItemsTableColumn } from '../collection-item.types';
import type { GetCollectionDetailsByIdRequestArgsDef } from './get-collection-details-by-id.types';

export const getCollectionDetailsByIdDbQuery = async (
  props: GetCollectionDetailsByIdRequestArgsDef & {
    userId: string;
  },
) => {
  const { collectionId, params, userId } = props;
  const { limit, page, search, searchNotes, sort } = params;

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
      columns: {
        userId: false,
      },
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
                data: true,
                id: true,
              },
            },
          },
        },
      },
    });

    const items = await tx.query.collectionItems.findMany({
      limit,
      offset: (page - 1) * limit,
      orderBy: (table, { asc, desc, sql }) => {
        const directionFn =
          sort.direction === sortDirectionOptions.desc ? desc : asc;

        const column = table[sortingField || 'name'];

        return directionFn(
          column.dataType === 'string' ? sql`lower(${column})` : sql`${column}`,
        );
      },
      where: {
        AND: [
          {
            collectionId,
            userId,
          },
          searchNotes
            ? {
                notes: {
                  ilike: `%${search.trim()}%`,
                },
              }
            : {
                name: {
                  ilike: `%${search.trim()}%`,
                },
              },
          // TODO - ADD FILTERS BACK IN (LOGIC AT BOTTOM)
        ],
      },
      with: {
        customFieldValues: {
          columns: {
            customFieldId: true,
            data: true,
            id: true,
          },
        },
      },
    });

    const formattedItems = items.map(({ customFieldValues, ...item }) => {
      const customFieldValuesByCustomFieldId =
        customFieldValues.reduce<CustomFieldValuesByFieldId>(
          (acc, { customFieldId, ...customFieldValue }) => {
            return {
              ...acc,
              [customFieldId]: customFieldValue,
            };
          },
          {},
        );

      return {
        ...item,
        customFieldValues: customFieldValuesByCustomFieldId,
      };
    });

    return {
      collection,
      items: formattedItems,
      pagination,
    };
  });
};

const formatFiltersSql = <
  TTable extends InferModelFromColumns<
    {
      name: any;
    } & Record<string, any>
  >,
>(props: {
  filters: {};
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
