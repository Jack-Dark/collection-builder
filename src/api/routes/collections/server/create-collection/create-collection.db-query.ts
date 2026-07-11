import { db } from '#/api/db';
import { collectionsTable } from '#/api/db-tables-schema';

import type { NewCollectionRecordDef } from '../types';

export const createCollectionDbQuery = async (data: NewCollectionRecordDef) => {
  const [newCollection] = await db
    .insert(collectionsTable)
    .values(data)
    .onConflictDoNothing()
    .returning();

  return newCollection;
};
