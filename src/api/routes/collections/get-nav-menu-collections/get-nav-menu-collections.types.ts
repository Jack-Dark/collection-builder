import type { QueryResponseDef } from '#/api/db-tables-schema.types';

import type { getNavMenuCollectionsDbQuery } from './get-nav-menu-collections.db-query';

export type GetNavMenuCollectionsRequestArgsDef = never;

export type GetNavMenuCollectionsResponseDef = QueryResponseDef<
  typeof getNavMenuCollectionsDbQuery
>;
