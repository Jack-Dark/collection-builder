import type z from 'zod';

import type { updateCollectionByIdDbQuery } from './update-collection-by-id.db-query';
import type {
  onUpdateCollectionsArgsSchema,
  updateCollectionsFormRecordSchema,
} from './update-collection-by-id.schema';

export type UpdateCollectionsFormRecordSchemaDef = z.output<
  typeof updateCollectionsFormRecordSchema
>;

export type OnUpdateCollectionsArgsDef = z.output<
  typeof onUpdateCollectionsArgsSchema
>;

export type UpdateCollectionByIdResponseDef = Awaited<
  ReturnType<typeof updateCollectionByIdDbQuery>
>;
