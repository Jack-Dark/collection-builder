import type { QueryResponseDef } from '#/api/db-tables-schema.types';

import type { getPaginatedCollectionsDbQuery } from './get-paginated-collections.db-query';

export type GetPaginatedCollectionsResponseDef = QueryResponseDef<
  typeof getPaginatedCollectionsDbQuery
>;
