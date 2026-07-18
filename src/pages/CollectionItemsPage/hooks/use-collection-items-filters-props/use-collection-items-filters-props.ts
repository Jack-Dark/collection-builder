import type { FiltersButtonPropsDef } from '#/components/Table/components/FilterButton/FilterButton.types';

import { useOnUpdateCollectionItemsQueries } from '../../components/CollectionItemsFiltersContent';
import { useCollectionItemsFiltersStore } from '../use-collection-items-filters-store';

export const useCollectionItemsFiltersProps = (): Omit<
  FiltersButtonPropsDef,
  'FiltersContent'
> => {
  const {
    defaultValues,
    getAllFilters: getFilters,
    numApplied,
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
