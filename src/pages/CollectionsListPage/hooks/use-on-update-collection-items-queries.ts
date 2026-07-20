import type { NavigateOptions } from '@tanstack/router-core';

import { Route as CollectionsListsPageRoute } from '#/routes/_protected/collections';

export const useOnUpdateCollectionsListQueries = () => {
  const navigate = CollectionsListsPageRoute.useNavigate();
  const searchQueries = CollectionsListsPageRoute.useSearch();

  const onUpdateCollectionsListQueries = async (
    updatedQueries: Partial<typeof searchQueries>,
    options?: NavigateOptions,
  ) => {
    const shouldResetPage = !!updatedQueries.limit || !!updatedQueries.search;

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

  return { onUpdateCollectionsListQueries, searchQueries };
};
