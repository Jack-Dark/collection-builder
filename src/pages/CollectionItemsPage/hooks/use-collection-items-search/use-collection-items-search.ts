import _ from 'lodash';

import { useOnUpdateCollectionItemsQueries } from '../../components/CollectionItemsFiltersContent';

export const useCollectionItemsSearch = () => {
  const { onUpdateCollectionItemsQueries, searchQueries } =
    useOnUpdateCollectionItemsQueries();

  const onChange = _.debounce(async (searchValue: string) => {
    const search = searchValue.trim();

    onUpdateCollectionItemsQueries({ search });
  }, 200);

  return {
    onChange,
    value: searchQueries.search,
  };
};
