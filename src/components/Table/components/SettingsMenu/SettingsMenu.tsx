import SettingsIcon from '@mui/icons-material/Settings';

import { MoreMenu } from '#/components/MoreMenu';

import type { TableSettingsMenuPropsDef } from './SettingsMenu.types';

const articlesToIgnore = ['the', 'a', 'an'];

export const TableSettingsMenu = (props: TableSettingsMenuPropsDef) => {
  const {
    enableIgnoreSortArticles,
    ignoreSortArticles,
    onClickIgnoreSortArticles,
  } = props;

  return (
    <div className="size-full flex items-center justify-center hover:text-theme-link-hover">
      <MoreMenu
        Icon={() => {
          return <SettingsIcon fontSize="inherit" />;
        }}
        items={[
          {
            active: ignoreSortArticles,
            hidden: !enableIgnoreSortArticles,
            id: 'ignore-sort-articles',
            Label: () => {
              return (
                <div>
                  <p>
                    Ignore articles when sorting (
                    {ignoreSortArticles ? 'enabled' : 'disabled'})
                  </p>
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
              );
            },
            onClick: () => {
              onClickIgnoreSortArticles?.(!ignoreSortArticles);
            },
          },
        ]}
      />
    </div>
  );
};
