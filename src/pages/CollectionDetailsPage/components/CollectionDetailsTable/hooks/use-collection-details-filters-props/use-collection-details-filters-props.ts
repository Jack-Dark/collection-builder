import type { FiltersButtonPropsDef } from '#/components/Table/components/FilterButton/FilterButton.types';

import { Route as CollectionRoute } from '#/routes/_protected/collections/$id';

import { useOnUpdateCollectionItemsQueries } from '../../../../hooks/use-on-update-collection-items-queries';

export const useCollectionDetailsFiltersProps = (): Omit<
  FiltersButtonPropsDef,
  'FiltersContent'
> => {
  const searchParams = CollectionRoute.useSearch();

  const numApplied = [].filter(Boolean).length;

  const { onUpdateCollectionItemsQueries } =
    useOnUpdateCollectionItemsQueries();

  const onReset = () => {
    // ON RESET
  };

  const onSubmit = () => {
    onUpdateCollectionItemsQueries({
      // filters
    });
  };

  return {
    numApplied,
    onCancel: () => {
      // ON CANCEL
    },
    onReset,
    onSubmit,
  };
};
