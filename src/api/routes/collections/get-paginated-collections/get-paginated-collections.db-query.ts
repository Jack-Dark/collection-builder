import { and, asc, count, desc, eq, ilike, inArray, isNull } from 'drizzle-orm';

import type { CustomFieldTypeDef } from '#/api/db-tables-schema.types';
import type { PaginationQueriesSchemaDef } from '#/api/pagination/pagination.types';

import { db } from '#/api/db';
import { sortDirectionOptions } from '#/api/pagination/pagination.constants';
import { getPaginationMetadataQuery } from '#/api/pagination/pagination.query';

import type { CollectionRecordDef } from '../collection.types';

import {
  collectionsTable,
  collectionsToCustomFieldsTable,
  customFieldsTable,
} from '../../../db-tables-schema';

export const getPaginatedCollectionsDbQuery = async (props: {
  params: PaginationQueriesSchemaDef;
  userId: string;
}) => {
  const { params, userId } = props;
  const { limit, page, search, sort } = params;

  return db.transaction(async (tx) => {
    const matchesUserAndSearch = and(
      eq(collectionsTable.userId, userId),
      isNull(collectionsTable.deletedAt),
      search
        ? ilike(collectionsTable.name, `%${search.toLowerCase()}%`)
        : undefined,
    );
    const [{ totalRecords }] = await tx
      .select({ totalRecords: count() })
      .from(collectionsTable)
      .where(matchesUserAndSearch);

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
      .where(matchesUserAndSearch)
      .limit(limit)
      .offset((page - 1) * limit)
      .orderBy(
        sort?.direction === sortDirectionOptions.desc
          ? desc(collectionsTable[sortingField])
          : asc(collectionsTable[sortingField]),
      );

    // TODO - INVESTIGATE OPTIONS TO CONSOLIDATE LOGIC
    const collectionIds = collections.map(({ id }) => {
      return id;
    });

    const customFields = await tx
      .select({
        collectionId: collectionsToCustomFieldsTable.collectionId,
        customField: {
          id: customFieldsTable.id,
          name: customFieldsTable.name,
          type: customFieldsTable.type,
        },
      })
      .from(collectionsToCustomFieldsTable)
      .leftJoin(
        customFieldsTable,
        eq(customFieldsTable.id, collectionsToCustomFieldsTable.customFieldId),
      )
      .where(
        inArray(collectionsToCustomFieldsTable.collectionId, collectionIds),
      );

    const customFieldsByCollectionId = customFields.reduce<
      Record<
        number,
        {
          id: number;
          name: string;
          type: CustomFieldTypeDef;
        }[]
      >
    >((acc, { collectionId, customField }) => {
      if (collectionId && customField) {
        const customFieldsForCollection = acc[collectionId] || [];

        return {
          ...acc,
          [collectionId]: [...customFieldsForCollection, customField],
        };
      }

      return acc;
    }, {});

    const collectionsWithCustomFields = collections.map((collection) => {
      return {
        ...collection,
        customFields: customFieldsByCollectionId[collection.id] || [],
      };
    });

    return {
      collections: collectionsWithCustomFields,
      pagination,
    };
  });
};
