import type { NavigateOptions } from '@tanstack/react-router';
import type { SortDirection } from '@tanstack/react-table';
import type { PropsWithChildren } from 'react';

import { useSearch } from '@tanstack/react-router';
import _ from 'lodash';
import { useEffect, useMemo } from 'react';

import type { CollectionItemsTableColumn } from '#/api/routes/collection-items/collection-item.types';
import type { CollectionItemsFiltersSchemaDef } from '#/api/routes/collection-items/get-collection-details-by-id/get-collection-details-by-id.types';
import type { CollectionRecordDef } from '#/api/routes/collections/collection.types';
import type { SortItemDef } from '#/components/Table';
import type { FiltersButtonPropsDef } from '#/components/Table/components/FilterButton/FilterButton.types';
import type { SetZustandStoreFnDef } from '#/helpers/get-create-default-zustand-state';

import { sortDirectionOptions } from '#/api/pagination/pagination.constants';
import { Button } from '#/components/Button';
import { CheckboxField } from '#/components/Fields/CheckboxField';
import { getCreateDefaultZustandStore } from '#/helpers/get-create-default-zustand-state';
import { Route } from '#/routes/_protected/collections/$id';

export const useSetCollectionItemsFiltersFromQueries = () => {
  const queries = useSearch({
    from: '/_protected/collections/$id',
  });

  const searchQueryFilters = queries?.filters;

  const { setAllFilters: setFilters } = useCollectionItemsFilters();

  useEffect(() => {
    if (searchQueryFilters) {
      setFilters(searchQueryFilters);
    }
  }, [searchQueryFilters]);
};

type CollectionItemsFiltersContentPropsDef = {
  collection: CollectionRecordDef;
  customFields: {
    customField1Values: string[];
    customField2Values: string[];
    customField3Values: string[];
  };
};

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

export const CollectionItemsFiltersContent = (
  props: CollectionItemsFiltersContentPropsDef,
) => {
  const { collection, customFields } = props;

  const {
    customField1Store,
    customField2Store,
    customField3Store,
    saveAllFiltersSnapshot,
  } = useCollectionItemsFilters();

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
          return prevFilters.filter((item) => {
            return item !== value;
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

export const useCollectionItemsFilterActions = (): Omit<
  FiltersButtonPropsDef,
  'FiltersContent'
> => {
  const {
    defaultValues,
    getAllFilters: getFilters,
    numApplied,
    restoreAllFiltersFromSnapshot,
  } = useCollectionItemsFilters();

  const { onUpdateCollectionItemsQueries } =
    useOnUpdateCollectionItemsQueries();

  const onReset = () => {
    onUpdateCollectionItemsQueries({ filters: defaultValues });
  };

  const onSubmit = () => {
    const filters = getFilters();

    onUpdateCollectionItemsQueries({ filters });
  };

  return {
    numApplied,
    onCancel: restoreAllFiltersFromSnapshot,
    onReset,
    onSubmit,
  };
};

export const useCollectionItemsSearch = () => {
  const { onUpdateCollectionItemsQueries, searchQueries } =
    useOnUpdateCollectionItemsQueries();

  const onChange = _.debounce(async (searchValue: string) => {
    const search = searchValue.trim();

    onUpdateCollectionItemsQueries({ search });
  }, 200);

  return {
    onChange,
    value: searchQueries.search,
  };
};

export type UnformattedSortItemDef<TField extends string> = (
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
};

export const formatSortItems = <TField extends string>(
  items: UnformattedSortItemDef<TField>[],
): SortItemDef<TField>[] => {
  const initialItems: SortItemDef<TField>[] = [];

  return items.reduce((accumulator, item) => {
    const { bidirectional, direction, field, hide, label } = item;

    const getFormattedLabel = (direction: SortDirection) => {
      const prefix =
        label ?? `${field.substring(0, 1).toUpperCase()}${field.substring(1)}`;

      return `${prefix}, ${direction}.`;
    };

    const getId = (direction: SortDirection) => {
      return `${field}_${direction}`;
    };

    if (hide) {
      return accumulator;
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

      return [...accumulator, itemAsc, itemDesc];
    }

    const formattedItem: SortItemDef<TField> = {
      direction,
      field,
      id: getId(direction),
      label: getFormattedLabel(direction),
    };

    return [...accumulator, formattedItem];
  }, initialItems);
};

export const useCollectionItemsSort = <
  TField extends CollectionItemsTableColumn,
>(props: {
  items: UnformattedSortItemDef<TField>[];
}) => {
  const { items } = props;

  const { onUpdateCollectionItemsQueries, searchQueries } =
    useOnUpdateCollectionItemsQueries();

  const formattedItems = useMemo(() => {
    return formatSortItems(items);
  }, [...items]);

  const onChange = (sort: SortItemDef<TField> | null) => {
    onUpdateCollectionItemsQueries({
      sort: {
        direction: sort?.direction || sortDirectionOptions.asc,
        field: sort?.field || 'name',
      },
    });
  };

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

export const useOnUpdateCollectionItemsQueries = () => {
  const navigate = Route.useNavigate();
  const searchQueries = Route.useSearch();

  const onUpdateCollectionItemsQueries = async (
    updatedQueries: Partial<typeof searchQueries>,
    options?: NavigateOptions,
  ) => {
    const { filters, limit, search } = updatedQueries;
    await navigate({
      search: {
        ...searchQueries,
        ...updatedQueries,
        page: filters || limit || search ? 1 : searchQueries.page || 1,
      },
      ...options,
    });
  };

  return { onUpdateCollectionItemsQueries, searchQueries };
};

const createFiltersStore = (defaultValues: CollectionItemsFiltersSchemaDef) => {
  const createCustomField1Store = getCreateDefaultZustandStore<string[]>(
    defaultValues.customField1,
  );
  const createCustomField2Store = getCreateDefaultZustandStore<string[]>(
    defaultValues.customField2,
  );
  const createCustomField3Store = getCreateDefaultZustandStore<string[]>(
    defaultValues.customField3,
  );

  return () => {
    const customField1Store = createCustomField1Store();
    const customField2Store = createCustomField2Store();
    const customField3Store = createCustomField3Store();

    const numApplied = [
      customField1Store.value.length,
      customField2Store.value.length,
      customField3Store.value.length,
    ].filter(Boolean).length;

    const getAllFilters = (): CollectionItemsFiltersSchemaDef => {
      return {
        customField1: customField1Store.getValue(),
        customField2: customField2Store.getValue(),
        customField3: customField3Store.getValue(),
      };
    };

    return {
      customField1Store,
      customField2Store,
      customField3Store,
      defaultValues,
      filters: {
        customField1: customField1Store.value,
        customField2: customField2Store.value,
        customField3: customField3Store.value,
      },
      getAllFilters,
      numApplied,
      resetAllFilters: () => {
        customField1Store.resetValue();
        customField2Store.resetValue();
        customField3Store.resetValue();
      },
      restoreAllFiltersFromSnapshot: () => {
        customField1Store.restoreFromSnapshot();
        customField2Store.restoreFromSnapshot();
        customField3Store.restoreFromSnapshot();
      },
      saveAllFiltersSnapshot: () => {
        return {
          customField1: customField1Store.saveSnapshot(),
          customField2: customField2Store.saveSnapshot(),
          customField3: customField3Store.saveSnapshot(),
        };
      },
      setAllFilters: (
        valueOrSetStore:
          | CollectionItemsFiltersSchemaDef
          | ((prevValue: CollectionItemsFiltersSchemaDef) => void),
      ) => {
        if (typeof valueOrSetStore === 'function') {
          const currentValue = getAllFilters();
          valueOrSetStore(currentValue);
        } else {
          const { customField1, customField2, customField3 } = valueOrSetStore;

          customField1Store.setValue(customField1);
          customField2Store.setValue(customField2);
          customField3Store.setValue(customField3);
        }
      },
    };
  };
};

export const useCollectionItemsFilters = createFiltersStore({
  customField1: [],
  customField2: [],
  customField3: [],
});
