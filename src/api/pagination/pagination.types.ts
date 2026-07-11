import type z from 'zod';

import type { optionalPaginationQueriesSchema } from './pagination.schema';

export type PaginationMetadata = {
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
};

export type PaginatedResponseData<T> = {
  data: T[];
  metadata: PaginationMetadata;
};

export type PaginationQueriesSchemaDef = z.output<
  typeof optionalPaginationQueriesSchema
>;
