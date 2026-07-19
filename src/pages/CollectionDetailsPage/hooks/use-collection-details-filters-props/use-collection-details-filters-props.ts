import type { FiltersButtonPropsDef } from '#/components/Table/components/FilterButton/FilterButton.types';

import { Route as CollectionRoute } from '#/routes/_protected/collections/$id';

import { useOnUpdateCollectionItemsQueries } from '../../components/CollectionDetailsTable/components/CollectionItemsFiltersContent';
import { useCollectionDetailsFiltersStore } from '../use-collection-details-filters-store';

export const useCollectionDetailsFiltersProps = (): Omit<
  FiltersButtonPropsDef,
  'FiltersContent'
> => {
  const searchParams = CollectionRoute.useSearch();

  const numApplied = [
    searchParams.filters.customField1.length,
    searchParams.filters.customField2.length,
    searchParams.filters.customField3.length,
  ].filter(Boolean).length;

  const {
    defaultValues,
    getAllFilters: getFilters,
    restoreAllFiltersFromSnapshot,
  } = useCollectionDetailsFiltersStore();

  const { onUpdateCollectionItemsQueries } =
    useOnUpdateCollectionItemsQueries();

  const onReset = () => {
    onUpdateCollectionItemsQueries({ filters: defaultValues });
  };

  const onSubmit = () => {
    const filters = getFilters();

    onUpdateCollectionItemsQueries({ filters });
  };

  return {
    numApplied,
    onCancel: restoreAllFiltersFromSnapshot,
    onReset,
    onSubmit,
  };
};
