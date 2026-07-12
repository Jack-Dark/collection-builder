import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import type z from 'zod';

import type { collectionItemsTable } from '../../db-tables-schema';
import type { createCollectionItemSchema } from './create-collection-item/create-collection-item.schema';
import type { updateCollectionItemByIdSchema } from './update-collection-item-by-id/update-collection-item-by-id.schema';

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
  typeof updateCollectionItemByIdSchema
>;
