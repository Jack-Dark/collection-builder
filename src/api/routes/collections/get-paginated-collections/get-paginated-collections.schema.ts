import z from 'zod';

import { optionalPaginationQueriesSchema } from '#/api/pagination/pagination.schema';

export const getPaginatedCollectionsSchema = z.object({
  params: optionalPaginationQueriesSchema,
});
