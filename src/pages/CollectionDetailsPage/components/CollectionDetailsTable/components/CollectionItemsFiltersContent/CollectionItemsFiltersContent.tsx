import type { SortDirection } from '@tanstack/react-table';
import type { PropsWithChildren } from 'react';

import { useEffect } from 'react';

import type { CollectionRecordDef } from '#/api/routes/collections/collection.types';
import type { SortItemDef } from '#/components/Table';
import type { SetZustandStoreFnDef } from '#/helpers/get-create-default-zustand-state';

import { sortDirectionOptions } from '#/api/pagination/pagination.constants';
import { Button } from '#/components/Button';

const FiltersBlock = (
  props: PropsWithChildren<{
    label: string | null;
    onReset: () => void;
  }>,
) => {
  const { children, label, onReset } = props;

  return (
    <div className="grid gap-1">
      <div className="flex items-center gap-2">
        <h5>{label}</h5>

        <Button
          className="font-normal"
          onClick={onReset}
          size="xs"
          text="Reset"
          variant="ghost"
        />
      </div>

      {children}
    </div>
  );
};

type CollectionDetailsFiltersContentPropsDef = {
  collection: CollectionRecordDef;
};

export const CollectionDetailsFiltersContent = (
  props: CollectionDetailsFiltersContentPropsDef,
) => {
  const { collection } = props;

  // const { saveAllFiltersSnapshot } = useCollectionDetailsFiltersStore();

  const getOnCheckedChange = (props: {
    setValue: SetZustandStoreFnDef<string[]>;
    value: string;
  }) => {
    const { setValue, value } = props;

    return (checked: boolean) => {
      if (checked) {
        setValue((prevFilters) => {
          return [...prevFilters, value];
        });
      } else {
        setValue((prevFilters) => {
          return prevFilters.filter((field) => {
            return field !== value;
          });
        });
      }
    };
  };

  useEffect(() => {
    // saveAllFiltersSnapshot();
  }, []);

  return (
    <div className="grid gap-5">
      <FiltersBlock
        label="EXAMPLE LABEL"
        onReset={() => {
          // ON RESET
        }}
      >
        CONTENT
      </FiltersBlock>
    </div>
  );
};

export type UnformattedSortItemDef<TField extends string> =
  | ((
      | {
          bidirectional: true;
          direction?: never;
        }
      | {
          bidirectional?: never;
          direction: SortDirection;
        }
    ) & {
      field: TField;
      /** Pass `true` to remove the item from the formatted output. */
      hide?: boolean;
      label?: string | null;
      separator?: never;
    })
  | { hide?: boolean; separator: true };

export const formatSortItems = <TField extends string>(
  items: UnformattedSortItemDef<TField>[],
): SortItemDef<TField>[] => {
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
};
