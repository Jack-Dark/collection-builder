import type ZodTypes from 'node_modules/zod/v4/classic/external.d.cts';

import type { getRequiredPaginationParamsSchema } from './schema';

export type PaginationParamsSchemaDef<TSortField extends string | undefined> =
  Omit<
    ZodTypes.Infer<ReturnType<typeof getRequiredPaginationParamsSchema>>,
    'sortField'
  > & {
    sortField?: TSortField;
  };

export type PaginationMetadata = {
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
};

export type PaginatedData<T> = {
  data: T[];
  metadata: PaginationMetadata;
};
