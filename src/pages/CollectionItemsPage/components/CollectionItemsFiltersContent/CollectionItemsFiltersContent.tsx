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
import type { SetZustandStateFnDef } from '#/helpers/get-create-default-zustand-state';

import { sortDirectionOptions } from '#/api/pagination/pagination.constants';
import { Button } from '#/components/Button';
import { CheckboxField } from '#/components/CheckboxField';
import { getCreateDefaultZustandState } from '#/helpers/get-create-default-zustand-state';
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
    customField1State,
    customField2State,
    customField3State,
    saveAllFiltersSnapshot,
  } = useCollectionItemsFilters();

  const getOnCheckedChange = (props: {
    setState: SetZustandStateFnDef<string[]>;
    value: string;
  }) => {
    const { setState, value } = props;

    return (checked: boolean) => {
      if (checked) {
        setState((prevFilters) => {
          return [...prevFilters, value];
        });
      } else {
        setState((prevFilters) => {
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
          onReset={customField1State.resetValue}
        >
          {customFields.customField1Values.map((value) => {
            const onCheckedChange = getOnCheckedChange({
              setState: customField1State.setValue,
              value,
            });

            return (
              <CheckboxField
                checked={customField1State.value.includes(value)}
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
          onReset={customField2State.resetValue}
        >
          {customFields.customField2Values.map((value) => {
            const onCheckedChange = getOnCheckedChange({
              setState: customField2State.setValue,
              value,
            });

            return (
              <CheckboxField
                checked={customField2State.value.includes(value)}
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
          onReset={customField3State.resetValue}
        >
          {customFields.customField3Values.map((value) => {
            const onCheckedChange = getOnCheckedChange({
              setState: customField3State.setValue,
              value,
            });

            return (
              <CheckboxField
                checked={customField3State.value.includes(value)}
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

type UnformattedSortItemDef<TField extends string> = (
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
    await navigate({
      search: {
        ...searchQueries,
        ...updatedQueries,
      },
      ...options,
    });
  };

  return { onUpdateCollectionItemsQueries, searchQueries };
};

const createFiltersState = (defaultValues: CollectionItemsFiltersSchemaDef) => {
  const createCustomField1State = getCreateDefaultZustandState<string[]>(
    defaultValues.customField1,
  );
  const createCustomField2State = getCreateDefaultZustandState<string[]>(
    defaultValues.customField2,
  );
  const createCustomField3State = getCreateDefaultZustandState<string[]>(
    defaultValues.customField3,
  );

  return () => {
    const customField1State = createCustomField1State();
    const customField2State = createCustomField2State();
    const customField3State = createCustomField3State();

    const numApplied = [
      customField1State.value.length,
      customField2State.value.length,
      customField3State.value.length,
    ].filter(Boolean).length;

    const getAllFilters = (): CollectionItemsFiltersSchemaDef => {
      return {
        customField1: customField1State.getValue(),
        customField2: customField2State.getValue(),
        customField3: customField3State.getValue(),
      };
    };

    return {
      customField1State,
      customField2State,
      customField3State,
      defaultValues,
      filters: {
        customField1: customField1State.value,
        customField2: customField2State.value,
        customField3: customField3State.value,
      },
      getAllFilters,
      numApplied,
      resetAllFilters: () => {
        customField1State.resetValue();
        customField2State.resetValue();
        customField3State.resetValue();
      },
      restoreAllFiltersFromSnapshot: () => {
        customField1State.restoreFromSnapshot();
        customField2State.restoreFromSnapshot();
        customField3State.restoreFromSnapshot();
      },
      saveAllFiltersSnapshot: () => {
        return {
          customField1: customField1State.saveSnapshot(),
          customField2: customField2State.saveSnapshot(),
          customField3: customField3State.saveSnapshot(),
        };
      },
      setAllFilters: (
        stateOrSetState:
          | CollectionItemsFiltersSchemaDef
          | ((prevState: CollectionItemsFiltersSchemaDef) => void),
      ) => {
        if (typeof stateOrSetState === 'function') {
          const currentState = getAllFilters();
          stateOrSetState(currentState);
        } else {
          const { customField1, customField2, customField3 } = stateOrSetState;

          customField1State.setValue(customField1);
          customField2State.setValue(customField2);
          customField3State.setValue(customField3);
        }
      },
    };
  };
};

export const useCollectionItemsFilters = createFiltersState({
  customField1: [],
  customField2: [],
  customField3: [],
});
