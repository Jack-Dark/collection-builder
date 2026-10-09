import type { ReactFormType } from '@tanstack/react-form';

import { formOptions, useForm } from '@tanstack/react-form';
import z from 'zod';

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

export const useCollectionDetailsFiltersProps = ({
  collectionId,
}: {
  collectionId: number;
}) => {
  const { data: filterOptions } = useGetFiltersForCollection({
    // TODO - create global store for when the filters have been opened
    enabled: false,
    placeholderData: [],
    requestArgs: { id: collectionId },
  });

  const { filters: searchQueryFilters } = CollectionDetailsRoute.useSearch();

  const formDefaults: CollectionItemsFiltersFormSchemaDef['filters'] =
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
    }, searchQueryFilters);

  const form = useForm({
    ...collectionItemsFiltersFormOptions,
    defaultValues: { filters: formDefaults },
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
    filterOptions,
    form,
    numApplied,
    onCancel: () => {
      // ON CANCEL
    },
    onReset: form.reset,
    onSubmit: async () => {
      await form.handleSubmit();
    },
  };
  // } satisfies Omit<FiltersButtonPropsDef, 'FiltersContent'>;
};
