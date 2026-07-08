import type z from 'zod';

import type { TimestampsDef } from '#/api/types';

import type { collectionsTable } from '../../../schema';
import type {
  createCollectionSchema,
  updateCollectionSchema,
} from './serverFns';

export type CollectionRecordDef = typeof collectionsTable.$inferSelect;

export type NewCollectionRecordDef = typeof collectionsTable.$inferInsert;

export type UpdateCollectionRecordDef = Partial<
  Omit<CollectionRecordDef, 'id' | 'userId' | keyof TimestampsDef>
> &
  Pick<CollectionRecordDef, 'id' | 'userId'>;

export type CreateCollectionSchemaDef = z.output<typeof createCollectionSchema>;

export type UpdateCollectionSchemaDef = z.output<typeof updateCollectionSchema>;
