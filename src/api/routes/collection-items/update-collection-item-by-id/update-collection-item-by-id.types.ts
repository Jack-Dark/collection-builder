import type z from 'zod';

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
