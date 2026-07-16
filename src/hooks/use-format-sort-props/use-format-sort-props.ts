import type { SortDirection } from '@tanstack/react-table';

import { useMemo } from 'react';

import type { PaginationQueriesSchemaDef } from '#/api/pagination/pagination.types';
import type { SortItemDef } from '#/components/Table';
import type { UnformattedSortItemDef } from '#/pages/CollectionItemsPage/components/CollectionItemsFiltersContent';

import { sortDirectionOptions } from '#/api/pagination/pagination.constants';

export const useFormatSortProps = <TField extends string>(props: {
  items: UnformattedSortItemDef<TField>[];
  onChange: (sort: SortItemDef<TField> | null) => void;
  searchQueries: PaginationQueriesSchemaDef;
}) => {
  const { items, onChange, searchQueries } = props;

  const formattedItems = useMemo(() => {
    const initialItems: SortItemDef<TField>[] = [];

    return items.reduce((acc, item) => {
      const { hide, separator } = item;

      if (separator) {
        return hide ? acc : [...acc, { separator }];
      } else {
        const { bidirectional, direction, field, label } = item;

        const getFormattedLabel = (direction: SortDirection) => {
          const prefix =
            label ??
            `${field.substring(0, 1).toUpperCase()}${field.substring(1)}`;

          return `${prefix}, ${direction}.`;
        };

        const getId = (direction: SortDirection) => {
          return `${field}_${direction}`;
        };

        if (hide) {
          return acc;
        }

        if (bidirectional) {
          const itemAsc: SortItemDef<TField> = {
            direction: sortDirectionOptions.asc,
            field,
            id: getId(sortDirectionOptions.asc),
            label: getFormattedLabel(sortDirectionOptions.asc),
          };
          const itemDesc: SortItemDef<TField> = {
            direction: sortDirectionOptions.desc,
            field,
            id: getId(sortDirectionOptions.desc),
            label: getFormattedLabel(sortDirectionOptions.desc),
          };

          return [...acc, itemAsc, itemDesc];
        }

        const formattedItem: SortItemDef<TField> = {
          direction,
          field,
          id: getId(direction),
          label: getFormattedLabel(direction),
        };

        return [...acc, formattedItem];
      }
    }, initialItems);
  }, [...items]);

  const { direction, field } = searchQueries.sort;
  const defaultValue = formattedItems.find((item) => {
    return item.field === field && item.direction === direction;
  });

  return {
    items: formattedItems,
    onChange,
    value: defaultValue,
  };
};
