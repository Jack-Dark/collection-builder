import type z from 'zod';

import type {
  QueryResponseDef,
  TimestampsDef,
} from '#/api/db-tables-schema.types';

import type { CollectionRecordDef } from '../collection.types';
import type { updateCollectionByIdDbQuery } from './update-collection-by-id.db-query';
import type { updateCollectionByIdSchema } from './update-collection-by-id.schema';

export type UpdateCollectionRecordDef = Partial<
  Omit<CollectionRecordDef, 'id' | 'userId' | keyof TimestampsDef>
> &
  Pick<CollectionRecordDef, 'id' | 'userId'>;

export type UpdateCollectionRequestArgsDef = z.output<
  typeof updateCollectionByIdSchema
>;

export type UpdateCollectionResponseDef = QueryResponseDef<
  typeof updateCollectionByIdDbQuery
>;
