import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import type z from 'zod';

import type { collectionItemsTable } from '../../../db-tables-schema';
import type {
  createCollectionItemSchema,
  updateCollectionItemSchema,
} from './serverFns';

export type CollectionItemRecordDef = InferSelectModel<
  typeof collectionItemsTable
>;

export type InsertCollectionItemRecordDef = Omit<
  InferInsertModel<typeof collectionItemsTable>,
  'images'
> &
  Pick<CreateCollectionItemSchemaDef, 'images'>;

export type CreateCollectionItemSchemaDef = z.output<
  typeof createCollectionItemSchema
>;

export type UpdateCollectionItemSchemaDef = z.output<
  typeof updateCollectionItemSchema
>;
