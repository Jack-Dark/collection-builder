import type { RouteComponent } from '@tanstack/react-router';

import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { revalidateLogic } from '@tanstack/react-form';
import { useRouterState } from '@tanstack/react-router';
import { useEffect, useMemo } from 'react';
import { create } from 'zustand';

import type { CollectionItemsTableColumn } from '#/api/routes/collection-items/collection-item.types';

import { useCreateCollectionItem } from '#/api/routes/collection-items/create-collection-item/create-collection-item.react-query';
import { useInvalidateGetCollectionDetailsById } from '#/api/routes/collection-items/get-collection-details-by-id/get-collection-details-by-id.react-query';
import { useUpdateCollectionItemById } from '#/api/routes/collection-items/update-collection-item-by-id/update-collection-item-by-id.react-query';
import { Button } from '#/components/Button';
import { useSpinner } from '#/components/FullPageLoadingSpinner/useSpinner';
import { Table, tableCellClasses } from '#/components/Table';
import { PageWrapper } from '#/page-wrapper';
import { Route as CollectionRoute } from '#/routes/_protected/collections/$id';

import type { AddCollectionItemFormSchemaDef } from './components/AddCollectionItemForm/types';

import { useEditingCollectionItemsRowIds } from '../CollectionsListPage/hooks/use-editing-collections-row-ids';
import { addOrUpdateCollectionItemFormSchema } from './addOrUpdateCollectionItemForm.schema';
import { getCollectionItemsTableColumns } from './columns';
import { AddCollectionItemFormTableRow } from './components/AddCollectionItemForm';
import {
  addCollectionItemFormDefaultValues,
  useAddCollectionItemForm,
} from './components/AddCollectionItemForm/constants';
import {
  CollectionItemsFiltersContent,
  useCollectionItemsFilterActions,
  useCollectionItemsSearch,
  useCollectionItemsSort,
  useOnUpdateCollectionItemsQueries,
  useSetCollectionItemsFiltersFromQueries,
} from './components/CollectionItemsFiltersContent';

export const useCollectionItemsFormStore = create<{
  collectionItemFormValues: AddCollectionItemFormSchemaDef;
  resetCollectionItemFormValues: () => void;
  setCollectionItemFormValues: (values: AddCollectionItemFormSchemaDef) => void;
}>((set) => {
  return {
    collectionItemFormValues: addCollectionItemFormDefaultValues,
    resetCollectionItemFormValues: () => {
      set({
        collectionItemFormValues: addCollectionItemFormDefaultValues,
      });
    },
    setCollectionItemFormValues: (values) => {
      set({
        collectionItemFormValues: values,
      });
    },
  };
});

const useSpinnerWhenRouterLoading = () => {
  const isLoading = useRouterState({
    select: (state) => {
      return state.status === 'pending';
    },
  });

  const { hideSpinner, showSpinner } = useSpinner();

  useEffect(() => {
    if (isLoading) {
      showSpinner();
    } else {
      hideSpinner();
    }
  }, [isLoading]);
};

export const CollectionItemsPage: RouteComponent = () => {
  const { collection, customFields, items, lastAddedItem, pagination } =
    CollectionRoute.useLoaderData();

  useSpinnerWhenRouterLoading();

  const {
    collectionItemFormValues,
    resetCollectionItemFormValues,
    setCollectionItemFormValues,
  } = useCollectionItemsFormStore();

  const invalidateGetCollectionDetailsById =
    useInvalidateGetCollectionDetailsById();

  const { onCreateCollectionItem } = useCreateCollectionItem({
    onSuccess: async () => {
      await invalidateGetCollectionDetailsById();

      resetCollectionItemFormValues();
    },
  });

  const { onUpdateCollectionItemById } = useUpdateCollectionItemById({
    onSuccess: async () => {
      await invalidateGetCollectionDetailsById();

      resetCollectionItemFormValues();
    },
  });

  const { addToEditingRowIds, isEditing, resetEditingRowIds } =
    useEditingCollectionItemsRowIds();

  const form = useAddCollectionItemForm({
    defaultValues: collectionItemFormValues,
    onSubmit: async ({ value }) => {
      if (value.id) {
        await onUpdateCollectionItemById(value);
      } else {
        await onCreateCollectionItem({
          // undefined values added long-hand to resolve type errors
          ...value,
          createdAt: undefined,
          id: undefined,
          userId: undefined,
        });
      }

      form.reset();
      resetEditingRowIds();
    },
    validationLogic: revalidateLogic({
      mode: 'submit',
      modeAfterSubmission: 'change',
    }),
    validators: {
      onSubmit: addOrUpdateCollectionItemFormSchema,
    },
  });

  const columns = useMemo(() => {
    return getCollectionItemsTableColumns(collection);
  }, []);

  const filtersProps = useCollectionItemsFilterActions();

  const searchProps = useCollectionItemsSearch();

  const sortProps = useCollectionItemsSort<CollectionItemsTableColumn>({
    items: [
      {
        bidirectional: true,
        field: 'customField1Value',
        hide: !collection.customField1Enabled,
        label: collection.customField1Label,
      },
      {
        bidirectional: true,
        field: 'customField2Value',
        hide: !collection.customField2Enabled,
        label: collection.customField2Label,
      },
      {
        bidirectional: true,
        field: 'customField3Value',
        hide: !collection.customField3Enabled,
        label: collection.customField3Label,
      },
    ],
  });

  const { onUpdateCollectionItemsQueries } =
    useOnUpdateCollectionItemsQueries();

  useSetCollectionItemsFiltersFromQueries();

  useEffect(() => {
    setCollectionItemFormValues({
      ...collectionItemFormValues,
      collectionId: collection.id,
      customField1Value: lastAddedItem?.customField1Value || '',
      customField2Value: lastAddedItem?.customField2Value || '',
      customField3Value: lastAddedItem?.customField3Value || '',
      notes: collectionItemFormValues.notes || '',
    });
  }, [lastAddedItem]);

  useEffect(() => {
    form.reset();
  }, [isEditing]);

  return (
    <PageWrapper
      childrenClassName="grid gap-4"
      title={
        collection?.name
          ? `${collection.name} (${pagination.totalRecords})`
          : '-'
      }
    >
      {!isEditing && (
        <div className="flex justify-end">
          <Button
            Icon={ControlPointIcon}
            onClick={() => {
              addToEditingRowIds('');
            }}
            text="Add New"
            variant="secondary"
          />
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <Table
          BodyTopRow={
            isEditing
              ? ({ tdClassNames: _tdClassNames, ...rest }) => {
                  return (
                    <AddCollectionItemFormTableRow
                      customField1Enabled={collection.customField1Enabled}
                      customField1Label={collection.customField1Label || ''}
                      customField2Enabled={collection.customField2Enabled}
                      customField2Label={collection.customField2Label || ''}
                      customField3Enabled={collection.customField3Enabled}
                      customField3Label={collection.customField3Label || ''}
                      customFields={customFields}
                      form={form}
                      onCancel={() => {
                        resetEditingRowIds();
                        resetCollectionItemFormValues();
                        form.reset();
                      }}
                      tdClassNames={tableCellClasses}
                      {...rest}
                    />
                  );
                }
              : undefined
          }
          columns={columns}
          data={items || []}
          filters={{
            FiltersContent: () => {
              return (
                <CollectionItemsFiltersContent
                  collection={collection}
                  customFields={customFields}
                />
              );
            },
            ...filtersProps,
          }}
          pagination={{
            limit: {
              onChange: (limit) => {
                onUpdateCollectionItemsQueries({ limit });
              },
              value: pagination.pageSize,
            },
            page: {
              max: pagination.totalPages,
              onChange: (page) => {
                onUpdateCollectionItemsQueries({ page });
              },
              value: pagination.currentPage,
            },
          }}
          search={searchProps}
          sort={{
            items: sortProps.items,
            onChange: sortProps.onChange,
            value: sortProps.value,
          }}
        />
      </form>
    </PageWrapper>
  );
};
