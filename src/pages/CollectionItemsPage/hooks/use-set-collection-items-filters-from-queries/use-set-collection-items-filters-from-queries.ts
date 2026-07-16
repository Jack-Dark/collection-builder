import { useEffect } from 'react';

import { Route } from '#/routes/_protected/collections/$id';

import { useCollectionItemsFiltersStore } from '../use-collection-items-filters-store';

export const useSetCollectionItemsFiltersFromQueries = () => {
  const searchQueries = Route.useSearch();

  const searchQueryFilters = searchQueries.filters;

  const { setAllFilters: setFilters } = useCollectionItemsFiltersStore();

  useEffect(() => {
    if (searchQueryFilters) {
      setFilters(searchQueryFilters);
    }
  }, [searchQueryFilters]);
};
