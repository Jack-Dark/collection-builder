import type { QueryResponseDef } from '#/api/db-tables-schema.types';

import type z from '../../../../../node_modules/zod/v4/classic/external.d.cts';
import type { getCollectionDetailsByIdDbQuery } from './get-collection-details-by-id.db-query';
import type {
  collectionItemsFiltersSchema,
  getCollectionDetailsByIdSchema,
} from './get-collection-details-by-id.schema';

export type CollectionItemsFiltersSchemaDef = z.output<
  typeof collectionItemsFiltersSchema
>;

export type GetCollectionDetailsByIdRequestArgsDef = z.output<
  typeof getCollectionDetailsByIdSchema
>;

export type GetCollectionDetailsByIdResponseDef = QueryResponseDef<
  typeof getCollectionDetailsByIdDbQuery
>;
