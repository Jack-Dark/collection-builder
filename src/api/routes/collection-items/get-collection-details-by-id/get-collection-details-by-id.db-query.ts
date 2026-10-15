import type { SQL } from 'drizzle-orm';
import type { PgColumn } from 'drizzle-orm/pg-core';

import {
  and,
  eq,
  ilike,
  inArray,
  sql,
  asc,
  desc,
  exists,
  between,
  notExists,
} from 'drizzle-orm';

import type { DbQueryArgsDef } from '#/auth/auth-middleware.types';

import { db } from '#/api/db';
import {
  collectionItemsTable,
  collectionItemsToCustomFieldValuesTable,
  customFieldsTable,
  customFieldValuesTable,
} from '#/api/db-tables-schema';
import { sortDirectionOptions } from '#/api/pagination/pagination.constants';
import { getPaginationMetadataQuery } from '#/api/pagination/pagination.query';

import type { CustomFieldValuesByFieldId } from '../../custom-field-values/custom-field-values.types';
import type { CollectionItemsTableColumn } from '../collection-item.types';
import type { GetCollectionDetailsByIdRequestArgsDef } from './get-collection-details-by-id.types';

export const getCollectionDetailsByIdDbQuery = async ({
  context,
  data,
}: DbQueryArgsDef<GetCollectionDetailsByIdRequestArgsDef>) => {
  const { collectionId, params } = data;
  const { filters, limit, page, search, searchNotes, sort } = params;

  const userId = context.user.id;

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
      ),
    );

    const pagination = getPaginationMetadataQuery({
      currentPage: page,
      pageSize: limit,
      totalRecords,
    });

    const collection = await tx.query.collections.findFirst({
      columns: {
        id: true,
        name: true,
      },
      where: {
        id: collectionId,
        userId,
      },
      with: {
        customFields: {
          columns: {
            order: true,
          },
          orderBy: {
            order: 'asc',
          },
          with: {
            customField: {
              columns: {
                id: true,
                name: true,
                type: true,
              },
            },
          },
        },
      },
    });

    const formattedFiltersSql = Object.entries(filters).reduce<
      (SQL | undefined)[]
    >((acc, [customFieldIdString, filter]) => {
      const customFieldId = Number(customFieldIdString);

      if (filter.type === 'string') {
        const { items } = filter;
        if (items.length) {
          return [
            ...acc,
            exists(
              tx
                .select({ exists: sql<boolean>`1` })
                .from(collectionItemsToCustomFieldValuesTable)
                .innerJoin(
                  customFieldValuesTable,
                  eq(
                    customFieldValuesTable.id,
                    collectionItemsToCustomFieldValuesTable.customFieldValueId,
                  ),
                )
                .innerJoin(
                  customFieldsTable,
                  eq(
                    customFieldsTable.id,
                    customFieldValuesTable.customFieldId,
                  ),
                )
                .where(
                  and(
                    eq(
                      collectionItemsTable.id,
                      collectionItemsToCustomFieldValuesTable.collectionItemId,
                    ),
                    eq(customFieldsTable.id, customFieldId),
                    inArray(customFieldValuesTable.valueText, items),
                  ),
                ),
            ),
          ];
        }
      } else if (filter.type === 'number') {
        const { range } = filter;
        const { max, min } = range;

        return [
          ...acc,
          exists(
            tx
              .select({ exists: sql<boolean>`1` })
              .from(collectionItemsToCustomFieldValuesTable)
              .innerJoin(
                customFieldValuesTable,
                eq(
                  customFieldValuesTable.id,
                  collectionItemsToCustomFieldValuesTable.customFieldValueId,
                ),
              )
              .innerJoin(
                customFieldsTable,
                eq(customFieldsTable.id, customFieldValuesTable.customFieldId),
              )
              .where(
                and(
                  eq(
                    collectionItemsTable.id,
                    collectionItemsToCustomFieldValuesTable.collectionItemId,
                  ),
                  eq(customFieldsTable.id, customFieldId),
                  between(customFieldValuesTable.valueNumber, min, max),
                ),
              ),
          ),
        ];
      } else if (filter.type === 'boolean') {
        const { value } = filter;
        if (value === true) {
          // ? check if `true` exists

          return [
            ...acc,
            exists(
              tx
                .select({ exists: sql<boolean>`1` })
                .from(collectionItemsToCustomFieldValuesTable)
                .innerJoin(
                  customFieldValuesTable,
                  eq(
                    customFieldValuesTable.id,
                    collectionItemsToCustomFieldValuesTable.customFieldValueId,
                  ),
                )
                .innerJoin(
                  customFieldsTable,
                  eq(
                    customFieldsTable.id,
                    customFieldValuesTable.customFieldId,
                  ),
                )
                .where(
                  and(
                    eq(
                      collectionItemsTable.id,
                      collectionItemsToCustomFieldValuesTable.collectionItemId,
                    ),
                    eq(customFieldsTable.id, customFieldId),
                    eq(customFieldValuesTable.valueBoolean, true),
                  ),
                ),
            ),
          ];
        } else if (value === false) {
          // ? check if `true` does not exist as `false` and `null` are presented the same way

          return [
            ...acc,
            notExists(
              tx
                .select({ exists: sql<boolean>`1` })
                .from(collectionItemsToCustomFieldValuesTable)
                .innerJoin(
                  customFieldValuesTable,
                  eq(
                    customFieldValuesTable.id,
                    collectionItemsToCustomFieldValuesTable.customFieldValueId,
                  ),
                )
                .innerJoin(
                  customFieldsTable,
                  eq(
                    customFieldsTable.id,
                    customFieldValuesTable.customFieldId,
                  ),
                )
                .where(
                  and(
                    eq(
                      collectionItemsTable.id,
                      collectionItemsToCustomFieldValuesTable.collectionItemId,
                    ),
                    eq(customFieldsTable.id, customFieldId),
                    eq(customFieldValuesTable.valueBoolean, true),
                  ),
                ),
            ),
          ];
        }
      }

      return acc;
    }, []);

    const getOrderBy = (column: PgColumn) => {
      const directionFn =
        sort.direction === sortDirectionOptions.desc ? desc : asc;

      return directionFn(
        column.dataType === 'string'
          ? // TODO - ADD SEARCH SETTINGS DIALOG TO IGNORE ARTICLES AND SEARCH NOTES
            sql`REGEXP_REPLACE(lower(${column}), '^(the|a|an)\\s+', '', 'i')`
          : sql`${column}`,
      );
    };

    const unformattedCollectionItemIds = tx
      .select({
        id: collectionItemsTable.id,
      })
      .from(collectionItemsTable)
      .where(
        and(
          eq(collectionItemsTable.collectionId, collectionId),
          eq(collectionItemsTable.userId, userId),
          searchNotes
            ? ilike(collectionItemsTable.notes, `%${search.trim()}%`)
            : ilike(collectionItemsTable.name, `%${search.trim()}%`),

          ...formattedFiltersSql,
        ),
      )
      .limit(limit)
      .offset((page - 1) * limit)
      .orderBy(getOrderBy(collectionItemsTable[sortingField || 'name']));

    const formattedCollectionItemIds = (await unformattedCollectionItemIds).map(
      ({ id }) => {
        return id;
      },
    );

    const items = await tx.query.collectionItems.findMany({
      columns: {
        userId: false,
      },
      limit,
      offset: (page - 1) * limit,
      orderBy: (table) => {
        return getOrderBy(table[sortingField || 'name']);
      },
      where: {
        AND: [
          {
            collectionId,
            id: {
              in: formattedCollectionItemIds,
            },
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
        ],
      },
      with: {
        customFieldValues: {
          columns: {},
          with: {
            customFieldValue: {
              columns: {
                customFieldId: true,
                id: true,
                valueBoolean: true,
                valueNumber: true,
                valueText: true,
              },
            },
          },
        },
      },
    });

    const formattedItems = items.map(({ customFieldValues, ...item }) => {
      const customFieldValuesByCustomFieldId =
        customFieldValues.reduce<CustomFieldValuesByFieldId>(
          (acc, { customFieldValue }) => {
            if (customFieldValue) {
              const { customFieldId, ...rest } = customFieldValue;

              return {
                ...acc,
                [customFieldId]: rest,
              };
            }

            return acc;
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
