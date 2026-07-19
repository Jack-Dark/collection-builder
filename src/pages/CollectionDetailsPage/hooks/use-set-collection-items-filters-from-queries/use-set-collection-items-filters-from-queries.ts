import { useEffect } from 'react';

import { Route } from '#/routes/_protected/collections/$id';

import { useCollectionDetailsFiltersStore } from '../../components/CollectionDetailsTable/hooks/use-collection-details-filters-store';

export const useSetCollectionItemsFiltersFromQueries = () => {
  const searchQueries = Route.useSearch();

  const searchQueryFilters = searchQueries.filters;

  const { setAllFilters: setFilters } = useCollectionDetailsFiltersStore();

  useEffect(() => {
    if (searchQueryFilters) {
      setFilters(searchQueryFilters);
    }
  }, [searchQueryFilters]);
};
