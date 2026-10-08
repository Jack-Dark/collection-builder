import type z from 'zod';

import type { updateCollectionItemsDbQuery } from './update-collection-item-by-id.db-query';
import type {
  onUpdateCollectionItemsArgsSchema,
  updateCollectionItemsServerFnSchema,
  updateCollectionItemsFormSchema,
} from './update-collection-item-by-id.schema';

export type UpdateCollectionItemsFormSchemaDef = z.output<
  typeof updateCollectionItemsFormSchema
>;

export type OnUpdateCollectionItemsArgsDef = z.output<
  typeof onUpdateCollectionItemsArgsSchema
>;

export type UpdateCollectionItemsRequestArgsDef = z.output<
  typeof updateCollectionItemsServerFnSchema
>;

export type UpdateCollectionItemsResponseDef = Awaited<
  ReturnType<typeof updateCollectionItemsDbQuery>
>;
