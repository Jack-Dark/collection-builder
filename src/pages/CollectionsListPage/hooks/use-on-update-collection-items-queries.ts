import type { NavigateOptions } from '@tanstack/router-core';

import { Route as CollectionsListsPageRoute } from '#/routes/_protected/collections';

export const useOnUpdateCollectionsListQueries = () => {
  const navigate = CollectionsListsPageRoute.useNavigate();
  const searchQueries = CollectionsListsPageRoute.useSearch();

  const onUpdateCollectionsListQueries = async (
    updatedQueries: Partial<typeof searchQueries>,
    options?: NavigateOptions,
  ) => {
    const updatedQueriesKeys = Object.keys(
      updatedQueries,
    ) as (keyof typeof searchQueries)[];
    const shouldUsePage =
      updatedQueriesKeys.length === 1 && updatedQueriesKeys[0] === 'page';

    const newSearch = {
      ...searchQueries,
      ...updatedQueries,
      page: shouldUsePage ? updatedQueries.page : 1,
    };

    await navigate({
      search: newSearch,
      ...options,
    });
  };

  return { onUpdateCollectionsListQueries, searchQueries };
};
