import type { PropsWithChildren } from 'react';

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
    {
      id: 'auto-populate',
      Label: () => {
        return (
          // TODO - FEATURE: ADD AUTO-POPULATE CUSTOM FIELD VALUES SUPPORT
          <WrapLabelWithStatus>
            Auto-populate new items with the last entered custom field values.
          </WrapLabelWithStatus>
        );
      },
    },
    {
      disabled: true,
      id: 'download',
      Label: () => {
        return (
          // TODO - FEATURE: ADD DOWNLOAD DATA SUPPORT
          <WrapLabelWithStatus>Download data (coming soon)</WrapLabelWithStatus>
        );
      },
    },
    {
      disabled: true,
      id: 'upload',
      Label: () => {
        return (
          // TODO - FEATURE: ADD UPLOAD DATA SUPPORT
          <WrapLabelWithStatus>Upload data (coming soon)</WrapLabelWithStatus>
        );
      },
    },
  ];

  return {
    items,
  } satisfies TableSettingsMenuPropsDef;
};

const WrapLabelWithStatus = (
  props: PropsWithChildren<{ active?: boolean }>,
) => {
  const { active, children } = props;
  const { searchQueries } = useOnUpdateCollectionItemsQueries();

  return (
    <div className="grid gap-3 grid-cols-[max-content_1fr] max-w-75">
      <div className="h-full w-6 flex items-center">
        {active !== undefined &&
          (searchQueries.ignoreSortArticles ? <CheckIcon /> : <CloseIcon />)}
      </div>
      <div>{children}</div>
    </div>
  );
};

const IgnoreSortArticlesLabel = () => {
  const { searchQueries } = useOnUpdateCollectionItemsQueries();

  return (
    <WrapLabelWithStatus active={searchQueries.ignoreSortArticles}>
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
    </WrapLabelWithStatus>
  );
};
