import type { TableSettingsMenuPropsDef } from '#/components/Table/components/TableSettingsMenu/TableSettingsMenu.types';

import { useOnUpdateCollectionItemsQueries } from '../../../../hooks/use-on-update-collection-items-queries';

export const useCollectionDetailsSettingsProps = () => {
  const { onUpdateCollectionItemsQueries, searchQueries } =
    useOnUpdateCollectionItemsQueries();

  const onClickIgnoreSortArticles = (ignoreSortArticles: boolean) => {
    onUpdateCollectionItemsQueries({ ignoreSortArticles });
  };

  return {
    enableIgnoreSortArticles: true,
    ignoreSortArticles: searchQueries.ignoreSortArticles,
    onClickIgnoreSortArticles,
  } satisfies TableSettingsMenuPropsDef;
};
