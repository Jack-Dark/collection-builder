import { db } from '#/api/db';

import type { CollectionItemRecordDef } from '../collection-item.types';
import type { CreateCollectionItemRequestArgsDef } from './create-collection-item.types';

import { collectionItemsTable } from '../../../db-tables-schema';

export const createCollectionItemDbQuery = async (
  data: CreateCollectionItemRequestArgsDef,
): Promise<CollectionItemRecordDef> => {
  const [record] = await db
    .insert(collectionItemsTable)
    .values(data)
    .onConflictDoNothing()
    .returning();

  return record;
};
