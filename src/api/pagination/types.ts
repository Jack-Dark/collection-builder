import type z from 'zod';

import type { getRequiredPaginationParamsSchema } from './schema';

export type PaginationParamsSchemaDef<TSortField extends string | undefined> =
  Omit<
    z.Infer<ReturnType<typeof getRequiredPaginationParamsSchema>>,
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
