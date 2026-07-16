import type { FiltersButtonPropsDef } from '#/components/Table/components/FilterButton/FilterButton.types';

import {
  useCollectionItemsFiltersStore,
  useOnUpdateCollectionItemsQueries,
} from '../../components/CollectionItemsFiltersContent';

export const useCollectionItemsFilters = (): Omit<
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
