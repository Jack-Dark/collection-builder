import { and, desc, asc, eq, isNull, count } from 'drizzle-orm';

import { db } from '#/api/db';
import { collectionItemsTable, collectionsTable } from '#/api/db-tables-schema';
import { sortDirectionOptions } from '#/api/pagination/pagination.constants';
import { getPaginationMetadataQuery } from '#/api/pagination/pagination.query';

import type { CollectionItemsTableColumn } from '../server/queries';
import type { CollectionItemsSearchQueriesSchemaDef } from './get-collection-details-by-id.types';

import { formatFilters } from '../server/queries';

export const getCollectionDetailsByIdDbQuery = async (props: {
  collectionId: number;
  params: CollectionItemsSearchQueriesSchemaDef;
  userId: string;
}) => {
  const { collectionId, params, userId } = props;
  const { filters, limit, page, search, sort } = params;

  const sortingField: CollectionItemsTableColumn =
    sort.field && collectionItemsTable.hasOwnProperty(sort.field)
      ? (sort.field as CollectionItemsTableColumn)
      : 'name';

  return db.transaction(async (tx) => {
    const [{ totalRecords }] = await tx
      .select({ totalRecords: count() })
      .from(collectionItemsTable);

    const pagination = getPaginationMetadataQuery({
      currentPage: page,
      pageSize: limit,
      totalRecords,
    });

    const [collection] = await tx
      .select({
        customField1Enabled: collectionsTable.customField1Enabled,
        customField1Label: collectionsTable.customField1Label,
        customField2Enabled: collectionsTable.customField2Enabled,
        customField2Label: collectionsTable.customField2Label,
        customField3Enabled: collectionsTable.customField3Enabled,
        customField3Label: collectionsTable.customField3Label,
        id: collectionsTable.id,
        name: collectionsTable.name,
      })
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

    const customField1Values = customField1.map(({ value }) => {
      return value;
    });

    const customField2Values = customField2.map(({ value }) => {
      return value;
    });

    const customField3Values = customField3.map(({ value }) => {
      return value;
    });

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
        asc(collectionItemsTable.name),
      );

    const [lastAddedItem] = await tx
      .select({
        customField1Value: collectionItemsTable.customField1Value,
        customField2Value: collectionItemsTable.customField2Value,
        customField3Value: collectionItemsTable.customField3Value,
      })
      .from(collectionItemsTable)
      .where(matchesCollectionIdAndUserIdAndNotDeleted)
      .orderBy(desc(collectionItemsTable.createdAt))
      .limit(1);

    return {
      collection,
      customFields: {
        customField1Values,
        customField2Values,
        customField3Values,
      },
      items,
      lastAddedItem,
      pagination,
    };
  });
};
