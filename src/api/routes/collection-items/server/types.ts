import type z from 'zod';

import type { TimestampsDef } from '#/api/types';

import type { collectionItemsTable } from '../../../schema';
import type {
  createCollectionItemSchema,
  updateCollectionItemSchema,
} from './serverFns';

export type CollectionItemRecordDef = typeof collectionItemsTable.$inferSelect;

export type NewCollectionItemRecordDef =
  typeof collectionItemsTable.$inferInsert;

export type UpdateCollectionItemRecordDef = Partial<
  Omit<CollectionItemRecordDef, keyof TimestampsDef>
> &
  Pick<CollectionItemRecordDef, 'id' | 'userId'>;

export type CreateCollectionItemSchemaDef = z.Infer<
  typeof createCollectionItemSchema
>;

export type UpdateCollectionItemSchemaDef = z.Infer<
  typeof updateCollectionItemSchema
>;
