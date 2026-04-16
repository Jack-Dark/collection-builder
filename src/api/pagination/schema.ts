import zod from 'zod';

import { sortDirectionOptions } from './constants';

export const getRequiredPaginationParamsSchema = <TSortField extends string>(
  sortFields: TSortField[],
) => {
  return zod.object({
    limit: zod.number().optional(),
    page: zod.number().optional(),
    search: zod.string().optional(),
    sortDirection: zod
      .union([
        zod.literal(sortDirectionOptions.asc),
        zod.literal(sortDirectionOptions.desc),
      ])
      .optional(),
    sortField: zod
      .union(
        sortFields.map((field) => {
          return zod.literal(field);
        }),
      )
      .optional(),
  });
};

export const getOptionalPaginationParamsSchema = <TSortField extends string>(
  sortFields: TSortField[],
) => {
  return getRequiredPaginationParamsSchema(sortFields).optional();
};
