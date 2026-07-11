import type z from '../../../../../node_modules/zod/v4/classic/external.d.cts';
import type {
  collectionItemsFiltersSchema,
  collectionItemsSearchQueriesSchema,
} from './get-items-by-collection-id.schema';

export type CollectionItemsFiltersSchemaDef = z.output<
  typeof collectionItemsFiltersSchema
>;

export type CollectionItemsSearchQueriesSchemaDef = z.output<
  typeof collectionItemsSearchQueriesSchema
>;
