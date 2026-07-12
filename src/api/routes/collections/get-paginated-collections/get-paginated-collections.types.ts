import type z from 'zod';

import type { QueryResponseDef } from '#/api/db-tables-schema.types';

import type { getPaginatedCollectionsDbQuery } from './get-paginated-collections.db-query';
import type { getPaginatedCollectionsSchema } from './get-paginated-collections.schema';

export type GetPaginatedCollectionsRequestArgsDef = z.output<
  typeof getPaginatedCollectionsSchema
>;

export type GetPaginatedCollectionsResponseDef = QueryResponseDef<
  typeof getPaginatedCollectionsDbQuery
>;
