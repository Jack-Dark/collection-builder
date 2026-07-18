import { useOnUpdateCollectionItemsQueries } from '../../components/CollectionItemsFiltersContent';

export const useCollectionItemsSearch = () => {
  const { onUpdateCollectionItemsQueries, searchQueries } =
    useOnUpdateCollectionItemsQueries();

  const onChange = async (search: string) => {
    onUpdateCollectionItemsQueries({ search });
  };

  return {
    onChange,
    value: searchQueries.search,
  };
};
