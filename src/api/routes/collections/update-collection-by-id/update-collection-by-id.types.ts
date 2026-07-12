import type z from 'zod';

import type { TimestampsDef } from '#/api/db-tables-schema.types';

import type { CollectionRecordDef } from '../collection.types';
import type { updateCollectionByIdSchema } from './update-collection-by-id.schema';

export type UpdateCollectionRecordDef = Partial<
  Omit<CollectionRecordDef, 'id' | 'userId' | keyof TimestampsDef>
> &
  Pick<CollectionRecordDef, 'id' | 'userId'>;

export type UpdateCollectionSchemaDef = z.output<
  typeof updateCollectionByIdSchema
>;
