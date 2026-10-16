import { useOnUpdateCollectionsListQueries } from '#/pages/CollectionsListPage/hooks/use-on-update-collection-list-queries';

export const useCollectionsListSearchProps = () => {
  const { onUpdateCollectionsListQueries, searchQueries } =
    useOnUpdateCollectionsListQueries();

  const onChange = async (search: string) => {
    onUpdateCollectionsListQueries({ search: search.trim() });
  };

  const onClickSearchNotes = (checked: boolean) => {
    onUpdateCollectionsListQueries({ searchNotes: checked });
  };

  return {
    onChange,
    onClickSearchNotes,
    searchNotes: searchQueries.searchNotes,
    value: searchQueries.search,
  };
};
