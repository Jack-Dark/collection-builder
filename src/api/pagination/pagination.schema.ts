import z from 'zod';

import {
  paginationDefaultValues,
  sortDirectionOptions,
} from './pagination.constants';

export const requiredPaginationQueriesSchema = z.object({
  limit: z.number().min(1).optional().default(paginationDefaultValues.limit),
  page: z.number().min(1).optional().default(paginationDefaultValues.page),
  search: z.string().optional().default(paginationDefaultValues.search),
  sort: z
    .object({
      direction: z
        .union([
          z.literal(sortDirectionOptions.asc),
          z.literal(sortDirectionOptions.desc),
        ])
        .default(paginationDefaultValues.sort.direction),
      field: z.string().default(paginationDefaultValues.sort.field),
    })
    .optional()
    .default(paginationDefaultValues.sort),
});

export const optionalPaginationQueriesSchema =
  requiredPaginationQueriesSchema.default(paginationDefaultValues);
