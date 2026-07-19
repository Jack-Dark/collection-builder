import type { NavigateOptions } from '@tanstack/react-router';
import type { SortDirection } from '@tanstack/react-table';
import type { PropsWithChildren } from 'react';

import { useEffect } from 'react';

import type { CollectionRecordDef } from '#/api/routes/collections/collection.types';
import type { SortItemDef } from '#/components/Table';
import type { SetZustandStoreFnDef } from '#/helpers/get-create-default-zustand-state';

import { sortDirectionOptions } from '#/api/pagination/pagination.constants';
import { Button } from '#/components/Button';
import { CheckboxField } from '#/components/Fields/CheckboxField';
import { useCollectionItemsFiltersStore } from '#/pages/CollectionDetailsPage/hooks/use-collection-items-filters-store';
import { Route } from '#/routes/_protected/collections/$id';

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
  customFields: {
    customField1Values: string[];
    customField2Values: string[];
    customField3Values: string[];
  };
};

export const CollectionDetailsFiltersContent = (
  props: CollectionDetailsFiltersContentPropsDef,
) => {
  const { collection, customFields } = props;

  const {
    customField1Store,
    customField2Store,
    customField3Store,
    saveAllFiltersSnapshot,
  } = useCollectionItemsFiltersStore();

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
    saveAllFiltersSnapshot();
  }, []);

  return (
    <div className="grid gap-5">
      {collection.customField1Enabled && (
        <FiltersBlock
          label={collection.customField1Label}
          onReset={customField1Store.resetValue}
        >
          {customFields.customField1Values.map((value) => {
            const onCheckedChange = getOnCheckedChange({
              setValue: customField1Store.setValue,
              value,
            });

            return (
              <CheckboxField
                checked={customField1Store.value.includes(value)}
                key={value}
                label={value}
                onCheckedChange={onCheckedChange}
              />
            );
          })}
        </FiltersBlock>
      )}

      {collection.customField2Enabled && (
        <FiltersBlock
          label={collection.customField2Label}
          onReset={customField2Store.resetValue}
        >
          {customFields.customField2Values.map((value) => {
            const onCheckedChange = getOnCheckedChange({
              setValue: customField2Store.setValue,
              value,
            });

            return (
              <CheckboxField
                checked={customField2Store.value.includes(value)}
                key={value}
                label={value}
                onCheckedChange={onCheckedChange}
              />
            );
          })}
        </FiltersBlock>
      )}

      {collection.customField3Enabled && (
        <FiltersBlock
          label={collection.customField3Label}
          onReset={customField3Store.resetValue}
        >
          {customFields.customField3Values.map((value) => {
            const onCheckedChange = getOnCheckedChange({
              setValue: customField3Store.setValue,
              value,
            });

            return (
              <CheckboxField
                checked={customField3Store.value.includes(value)}
                key={value}
                label={value}
                onCheckedChange={onCheckedChange}
              />
            );
          })}
        </FiltersBlock>
      )}
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

export const useOnUpdateCollectionItemsQueries = () => {
  const navigate = Route.useNavigate();
  const searchQueries = Route.useSearch();

  const onUpdateCollectionItemsQueries = async (
    updatedQueries: Partial<typeof searchQueries>,
    options?: NavigateOptions,
  ) => {
    const { filters, limit, search } = updatedQueries;
    const newSearch = {
      ...searchQueries,
      ...updatedQueries,
      page: filters || limit || search ? 1 : searchQueries.page || 1,
    };

    await navigate({
      search: newSearch,
      ...options,
    });
  };

  return { onUpdateCollectionItemsQueries, searchQueries };
};
