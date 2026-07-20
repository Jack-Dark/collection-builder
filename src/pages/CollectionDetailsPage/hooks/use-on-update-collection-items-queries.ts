import type { NavigateOptions } from '@tanstack/router-core';

import { Route as CollectionDetailsPageRoute } from '#/routes/_protected/collections/$id';

export const useOnUpdateCollectionItemsQueries = () => {
  const navigate = CollectionDetailsPageRoute.useNavigate();
  const searchQueries = CollectionDetailsPageRoute.useSearch();

  const onUpdateCollectionItemsQueries = async (
    updatedQueries: Partial<typeof searchQueries>,
    options?: NavigateOptions,
  ) => {
    const shouldResetPage =
      !!updatedQueries.filters ||
      !!updatedQueries.limit ||
      !!updatedQueries.search;

    const newSearch = {
      ...searchQueries,
      ...updatedQueries,
      page: shouldResetPage ? 1 : searchQueries.page,
    };

    await navigate({
      search: newSearch,
      ...options,
    });
  };

  return { onUpdateCollectionItemsQueries, searchQueries };
};
