import type { FiltersButtonPropsDef } from '#/components/Table/components/FilterButton/FilterButton.types';

import { Route as CollectionRoute } from '#/routes/_protected/collections/$id';

import { useOnUpdateCollectionItemsQueries } from '../../components/CollectionDetailsTable/components/CollectionItemsFiltersContent';
import { useCollectionItemsFiltersStore } from '../use-collection-items-filters-store';

export const useCollectionItemsFiltersProps = (): Omit<
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
  } = useCollectionItemsFiltersStore();

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
