import z from 'zod';

import { getRequiredPaginationQueriesSchema } from '#/api/pagination/pagination.schema';

import type { CollectionTableColumnsDef } from '../collection.types';

export const getPaginatedCollectionsSchema = z.object({
  params: getRequiredPaginationQueriesSchema<CollectionTableColumnsDef>('name'),
});
