import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import type z from 'zod';

import type { TimestampsDef } from '#/api/types';

import type { collectionItemsTable } from '../../../schema';
import type {
  createCollectionItemSchema,
  updateCollectionItemSchema,
} from './serverFns';

export type CollectionItemRecordDef = InferSelectModel<
  typeof collectionItemsTable
>;

export type NewCollectionItemRecordDef = InferInsertModel<
  typeof collectionItemsTable
>;

export type UpdateCollectionItemRecordDef = Partial<
  Omit<CollectionItemRecordDef, keyof TimestampsDef>
> &
  Pick<CollectionItemRecordDef, 'id' | 'userId'>;

export type CreateCollectionItemSchemaDef = z.output<
  typeof createCollectionItemSchema
>;

export type UpdateCollectionItemSchemaDef = z.output<
  typeof updateCollectionItemSchema
>;
