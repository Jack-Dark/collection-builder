import type { NavigateOptions } from '@tanstack/router-core';

import { Route as CollectionDetailsPageRoute } from '#/routes/_protected/collections/$id';

export const useOnUpdateCollectionItemsQueries = () => {
  const navigate = CollectionDetailsPageRoute.useNavigate();
  const searchQueries = CollectionDetailsPageRoute.useSearch();

  const onUpdateCollectionItemsQueries = async (
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
      page: shouldUsePage ? searchQueries.page : 1,
    };

    await navigate({
      search: newSearch,
      ...options,
    });
  };

  return { onUpdateCollectionItemsQueries, searchQueries };
};
