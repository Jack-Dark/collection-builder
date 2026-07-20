import { useOnUpdateCollectionItemsQueries } from '../../../../hooks/use-on-update-collection-items-queries';

export const useCollectionDetailsSearchProps = () => {
  const { onUpdateCollectionItemsQueries, searchQueries } =
    useOnUpdateCollectionItemsQueries();

  const onChange = async (search: string) => {
    onUpdateCollectionItemsQueries({ search });
  };

  const onClickSearchNotes = (checked: boolean) => {
    onUpdateCollectionItemsQueries({ searchNotes: checked });
  };

  return {
    onChange,
    onClickSearchNotes,
    searchNotes: searchQueries.searchNotes,
    value: searchQueries.search,
  };
};
