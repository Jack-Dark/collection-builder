import type { PaginationMetadata } from './pagination.types';

export const sortDirectionOptions = {
  asc: 'asc',
  desc: 'desc',
} as const;

export const paginationPropsDefaultValues = {
  limit: 100,
  page: 1,
  search: '',
  sort: {
    direction: sortDirectionOptions.asc,
  },
};

export const getPaginationMetadataDefaults = (limit: number = 100) => {
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
