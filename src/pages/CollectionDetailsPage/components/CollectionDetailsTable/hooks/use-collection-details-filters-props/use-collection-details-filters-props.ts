import type { ReactFormType } from '@tanstack/react-form';

import { formOptions, useForm } from '@tanstack/react-form';
import z from 'zod';

import type { FiltersButtonPropsDef } from '#/components/Table/components/FilterButton/FilterButton.types';

import { collectionDetailsFiltersSchema } from '#/api/routes/collection-items/get-collection-details-by-id/get-collection-details-by-id.schema';
import { useGetFiltersForCollection } from '#/api/routes/collection-items/get-filters-for-collection/get-filters-for-collection.react-query';
import { Route as CollectionDetailsRoute } from '#/routes/_protected/collections/$id';

import { useOnUpdateCollectionItemsQueries } from '../../../../hooks/use-on-update-collection-items-queries';

const collectionItemFiltersFormSchema = z.object({
  filters: collectionDetailsFiltersSchema,
});

export type CollectionItemsFiltersFormSchemaDef = z.output<
  typeof collectionItemFiltersFormSchema
>;

const collectionItemsFiltersFormEmptyDefaults: CollectionItemsFiltersFormSchemaDef =
  { filters: {} };

export const collectionItemsFiltersFormOptions = formOptions({
  defaultValues: collectionItemsFiltersFormEmptyDefaults,
  formId: 'collection-item-filters',
  validators: [
    {
      run: collectionItemFiltersFormSchema,
      triggers: ['change'],
    },
  ],
});

export type CollectionItemsFiltersFormDef = ReactFormType<
  typeof collectionItemsFiltersFormOptions
>;

type UseCreateFiltersFormValuesPropsDef = {
  startingValues: CollectionItemsFiltersFormSchemaDef['filters'];
};

const useCreateCollectionFiltersFormValues = (
  props: UseCreateFiltersFormValuesPropsDef,
) => {
  const { startingValues = {} } = props;

  const { id } = CollectionDetailsRoute.useParams();
  const collectionId = Number(id);

  const { data: filterOptions } = useGetFiltersForCollection({
    placeholderData: [],
    requestArgs: { id: collectionId },
  });

  const formFullResetValues: CollectionItemsFiltersFormSchemaDef['filters'] =
    filterOptions.reduce<
      Record<number, CollectionItemsFiltersFormSchemaDef['filters'][number]>
    >((acc, { id, range, type }) => {
      if (acc[id]) {
        return acc;
      } else {
        if (type === 'string') {
          const emptyItems: string[] = [];

          return {
            ...acc,
            [id]: {
              items: emptyItems,
              range: undefined,
              type,
              value: undefined,
            } satisfies CollectionItemsFiltersFormSchemaDef['filters'][number],
          };
        }
        if (type === 'number') {
          return {
            ...acc,
            [id]: {
              items: undefined,
              range,
              type,
              value: undefined,
            } satisfies CollectionItemsFiltersFormSchemaDef['filters'][number],
          };
        }
        if (type === 'boolean') {
          return {
            ...acc,
            [id]: {
              items: undefined,
              range: undefined,
              type,
              value: null,
            } satisfies CollectionItemsFiltersFormSchemaDef['filters'][number],
          };
        }
      }

      return acc;
    }, startingValues);

  return formFullResetValues;
};

export const useCollectionDetailsFiltersProps = () => {
  const { filters: searchQueryFilters } = CollectionDetailsRoute.useSearch();

  const defaultValues = useCreateCollectionFiltersFormValues({
    startingValues: searchQueryFilters,
  });

  const fullResetValues = useCreateCollectionFiltersFormValues({
    startingValues: {},
  });

  const form = useForm({
    ...collectionItemsFiltersFormOptions,
    defaultValues: { filters: defaultValues },
    onSubmit: ({ value }) => {
      onUpdateCollectionItemsQueries({
        filters: value.filters,
      });
    },
  });

  const numApplied = [].filter(Boolean).length;

  const { onUpdateCollectionItemsQueries } =
    useOnUpdateCollectionItemsQueries();

  return {
    form,
    numApplied,
    onCancel: () => {
      form.setFieldValue('filters', defaultValues);
    },
    onReset: async () => {
      form.setFieldValue('filters', fullResetValues);
      await form.handleSubmit();
    },
    onSubmit: async () => {
      await form.handleSubmit();
    },
  } satisfies Omit<FiltersButtonPropsDef, 'FiltersContent'> & {
    form: CollectionItemsFiltersFormDef;
  };
};
