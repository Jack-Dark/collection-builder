import { useOnUpdateCollectionsListQueries } from '#/pages/CollectionsListPage/hooks/use-on-update-collection-items-queries';

export const useCollectionsListSearchProps = () => {
  const { onUpdateCollectionsListQueries, searchQueries } =
    useOnUpdateCollectionsListQueries();

  const onChange = async (search: string) => {
    onUpdateCollectionsListQueries({ search });
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
