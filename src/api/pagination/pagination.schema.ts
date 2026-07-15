import z from 'zod';

import {
  paginationDefaultValues,
  sortDirectionOptions,
} from './pagination.constants';

export const getRequiredPaginationQueriesSchema = <TSortField extends string>(
  defaultSortField: TSortField,
) => {
  return z.object({
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
        field: z.string().default(defaultSortField),
      })
      .optional()
      .default({
        direction: paginationDefaultValues.sort.direction,
        field: defaultSortField,
      }),
  });
};
