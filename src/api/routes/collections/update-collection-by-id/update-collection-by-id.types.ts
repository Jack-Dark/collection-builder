import type z from 'zod';

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
