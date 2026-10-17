import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useMemo } from 'react';

import type { MenuItemDef } from '#/components/MoreMenu/MoreMenu.types';
import type { TableSettingsMenuPropsDef } from '#/components/Table/components/TableSettingsMenu/TableSettingsMenu.types';

import { useOnUpdateCollectionItemsQueries } from '../../../../hooks/use-on-update-collection-items-queries';

const articlesToIgnore = ['the', 'a', 'an'];

export const useCollectionDetailsSettingsProps = () => {
  const { onUpdateCollectionItemsQueries, searchQueries } =
    useOnUpdateCollectionItemsQueries();

  const onClickIgnoreSortArticles = (ignoreSortArticles: boolean) => {
    onUpdateCollectionItemsQueries({ ignoreSortArticles });
  };

  const MemoizedIgnoreSortArticlesLabel = useMemo(() => {
    return IgnoreSortArticlesLabel;
  }, []);

  const items: MenuItemDef[] = [
    {
      active: searchQueries.ignoreSortArticles,
      id: 'ignore-sort-articles',
      Label: MemoizedIgnoreSortArticlesLabel,
      onClick: () => {
        onClickIgnoreSortArticles?.(!searchQueries.ignoreSortArticles);
      },
    },
  ];

  return {
    items,
  } satisfies TableSettingsMenuPropsDef;
};

const IgnoreSortArticlesLabel = () => {
  const { searchQueries } = useOnUpdateCollectionItemsQueries();

  return (
    <div className="grid gap-3 grid-cols-[max-content_1fr]">
      <div className="h-full w-6 flex items-center">
        {searchQueries.ignoreSortArticles ? <CheckIcon /> : <CloseIcon />}
      </div>
      <div>
        <p>Ignore articles when sorting</p>
        <span className="text-theme-t2 text-sm">
          (Values that start with{' '}
          {articlesToIgnore.reduce((acc, value, index) => {
            const isLastIndex = index === articlesToIgnore.length - 1;
            const formattedValue = `"${value}"`;
            if (isLastIndex) {
              return `${acc} or ${formattedValue}`;
            } else {
              return `${acc}${formattedValue}, `;
            }
          }, '')}
          )
        </span>
      </div>
    </div>
  );
};
