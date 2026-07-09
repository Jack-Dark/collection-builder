import type { PaginationMetadata } from './types';

export const sortDirectionOptions = {
  asc: 'asc',
  desc: 'desc',
} as const;

export const getPaginationMetadataDefaults = (limit: number) => {
  const metadata: PaginationMetadata = {
    currentPage: 1,
    hasNextPage: false,
    hasPrevPage: false,
    pageSize: limit,
    totalPages: 1,
    totalRecords: 0,
  };

  return metadata;
};
