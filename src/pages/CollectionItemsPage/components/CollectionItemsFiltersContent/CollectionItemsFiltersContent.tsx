import { useNavigate, useSearch } from '@tanstack/react-router';
import { useCallback, useEffect } from 'react';

import type { CollectionRecordDef } from '#/api/routes/collections/server/types';
import type {
  CollectionItemsFiltersSchemaDef,
  SortSchemaDef,
} from '#/routes/api/collections/$id';

import { sortDirectionOptions } from '#/api/pagination/constants';
import { CheckboxField } from '#/components/CheckboxField';
import { getCreateDefaultZustandState } from '#/helpers/get-create-default-zustand-state';
import { Route } from '#/routes/_protected/collections/$id';

type CollectionItemsFiltersContentPropsDef = {
  collection: CollectionRecordDef;
  customFields: {
    customField1Values: string[];
    customField2Values: string[];
    customField3Values: string[];
  };
};

export const CollectionItemsFiltersContent = (
  props: CollectionItemsFiltersContentPropsDef,
) => {
  const { collection, customFields } = props;

  const { filters, setFilters } = useCollectionItemsFilters();

  const queries = useSearch({
    from: '/_protected/collections/$id',
  });

  const getOnCheckedChange = (props: {
    customFieldKey: 'customField1' | 'customField2' | 'customField3';
    value: string;
  }) => {
    return (checked: boolean): void => {
      const { customFieldKey, value } = props;
      if (checked) {
        setFilters((prevFilters) => {
          const newSelections = [...prevFilters[customFieldKey], value];

          return {
            ...prevFilters,
            [customFieldKey]: newSelections,
          };
        });
      } else {
        setFilters((prevFilters) => {
          const newSelections = prevFilters[customFieldKey].filter((item) => {
            return item !== value;
          });

          return {
            ...prevFilters,
            [customFieldKey]: newSelections,
          };
        });
      }
    };
  };

  const searchQueryFilters = queries?.filters;

  useEffect(() => {
    if (searchQueryFilters) {
      setFilters(searchQueryFilters);
    }
  }, [searchQueryFilters]);

  return (
    <div className="grid gap-5">
      {([1, 2, 3] as const).map((num) => {
        const isEnabled = collection[`customField${num}Enabled`];
        const label = collection[`customField${num}Label`];
        const values = customFields[`customField${num}Values`];
        const customFieldKey = `customField${num}` as const;

        return (
          <div className="grid gap-1" key={num}>
            {isEnabled && (
              <>
                <h5>{label}</h5>
                {values.map((value) => {
                  const onCheckedChange = getOnCheckedChange({
                    customFieldKey,
                    value,
                  });

                  return (
                    <CheckboxField
                      checked={filters[customFieldKey].includes(value)}
                      key={value}
                      label={value}
                      onCheckedChange={onCheckedChange}
                    />
                  );
                })}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

const createFiltersState = (defaultValues: CollectionItemsFiltersSchemaDef) => {
  const createState = getCreateDefaultZustandState(defaultValues);

  return () => {
    const { getValue, resetValue, setValue, value } = createState();

    return {
      filters: value,
      getFilters: getValue,
      resetFilters: resetValue,
      setFilters: setValue,
    };
  };
};

export const useCollectionItemsFilters = createFiltersState({
  customField1: [],
  customField2: [],
  customField3: [],
});

const createSearchState = (defaultValue: string = '') => {
  const createState = getCreateDefaultZustandState(defaultValue);

  return () => {
    const { getValue, resetValue, setValue, value } = createState();

    return {
      getSearch: getValue,
      resetSearch: resetValue,
      search: value,
      setSearch: setValue,
    };
  };
};

export const useSearchState = createSearchState();

const createSortState = (defaultValues: SortSchemaDef) => {
  const createState = getCreateDefaultZustandState(defaultValues);

  return () => {
    const { getValue, resetValue, setValue, value } = createState();

    return {
      getSort: getValue,
      resetSort: resetValue,
      setSort: setValue,
      sort: value,
    };
  };
};

export const useSortState = createSortState({
  direction: sortDirectionOptions.asc,
  field: 'name',
});

export const useCollectionItemsFilterActions = (collectionId: number) => {
  const navigate = useNavigate({ from: Route.fullPath });

  const { getFilters, resetFilters } = useCollectionItemsFilters();

  const onReset = useCallback(() => {
    resetFilters();

    navigate({
      params: { id: String(collectionId) },
      reloadDocument: true,
      resetScroll: true,
      to: Route.fullPath,
    });
  }, []);

  const onSubmit = useCallback(async () => {
    const filters = getFilters();

    navigate({
      params: { id: String(collectionId) },
      reloadDocument: true,
      resetScroll: true,
      search: {
        filters,
      },
      to: Route.fullPath,
    });
  }, []);

  return {
    onReset,
    onSubmit,
  };
};
