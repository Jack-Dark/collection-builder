import type { RouteComponent } from '@tanstack/react-router';

import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { revalidateLogic } from '@tanstack/react-form';
import { useEffect, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';

import type { CollectionItemsTableColumn } from '#/api/routes/collection-items/collection-item.types';
import type { CreateCollectionItemFormSchemaDef } from '#/api/routes/collection-items/create-collection-item/create-collection-item.types';
import type { UpdateCollectionItemFormSchemaDef } from '#/api/routes/collection-items/update-collection-item-by-id/update-collection-item-by-id.types';

import { useCreateCollectionItem } from '#/api/routes/collection-items/create-collection-item/create-collection-item.react-query';
import {
  useGetCollectionDetailsById,
  useInvalidateGetCollectionDetailsById,
} from '#/api/routes/collection-items/get-collection-details-by-id/get-collection-details-by-id.react-query';
import { useUpdateCollectionItemById } from '#/api/routes/collection-items/update-collection-item-by-id/update-collection-item-by-id.react-query';
import { Button } from '#/components/Button';
import { Table, tableCellClasses } from '#/components/Table';
import { getCreateDefaultZustandState } from '#/helpers/get-create-default-zustand-state';
import { PageWrapper } from '#/page-wrapper';
import { Route as CollectionRoute } from '#/routes/_protected/collections/$id';

import { useEditingCollectionItemsRowIds } from '../CollectionsListPage/hooks/use-editing-collections-row-ids';
import { addOrUpdateCollectionItemFormSchema } from './addOrUpdateCollectionItemForm.schema';
import { getCollectionItemsTableColumns } from './columns';
import { AddCollectionItemFormTableRow } from './components/AddCollectionItemForm';
import {
  addCollectionItemFormDefaultValues,
  useAddCollectionItemForm,
} from './components/AddCollectionItemForm/add-or-update-collection-item-form.schema';
import {
  CollectionItemsFiltersContent,
  useCollectionItemsFilterActions,
  useCollectionItemsSearch,
  useCollectionItemsSort,
  useOnUpdateCollectionItemsQueries,
  useSetCollectionItemsFiltersFromQueries,
} from './components/CollectionItemsFiltersContent';

const createFormStore = <TData extends Record<string, any>>(
  defaultValues: TData,
) => {
  const createState = getCreateDefaultZustandState(defaultValues);

  return () => {
    const { restoreFromSnapshot, saveSnapshot, setValue, value } =
      createState();

    const resetWithLastAddedValues = (customFields: {
      customField1Value: string;
      customField2Value: string;
      customField3Value: string;
    }) => {
      setValue({
        ...defaultValues,
        ...customFields,
      });
      saveSnapshot();
    };

    return {
      formValues: value,
      resetFormValues: restoreFromSnapshot,
      resetWithLastAddedValues,
      setFormValues: setValue,
    };
  };
};

export const useCollectionItemsFormStore = createFormStore(
  addCollectionItemFormDefaultValues,
);

export const CollectionItemsPage: RouteComponent = () => {
  const { id } = CollectionRoute.useParams();
  const collectionId = Number(id);
  const search = CollectionRoute.useSearch();

  const { data } = useGetCollectionDetailsById({
    requestArgs: { collectionId, params: search },
  });
  const { collection, customFields, items, lastAddedItem, pagination } = data;

  const { formValues, resetWithLastAddedValues } =
    useCollectionItemsFormStore();

  const invalidateGetCollectionDetailsById =
    useInvalidateGetCollectionDetailsById();

  const { onCreateCollectionItem } = useCreateCollectionItem({
    onSuccess: async () => {
      await invalidateGetCollectionDetailsById({ id: collection.id });

      form.reset();
    },
  });

  const { onUpdateCollectionItemById } = useUpdateCollectionItemById({
    onSuccess: async () => {
      await invalidateGetCollectionDetailsById({ id: collection.id });

      form.reset();
    },
  });

  const { addToEditingRowIds, isEditing, resetEditingRowIds } =
    useEditingCollectionItemsRowIds();

  const form = useAddCollectionItemForm({
    defaultValues: formValues,
    onSubmit: async ({ value }) => {
      if (typeof value.id === 'number') {
        const data = value as UpdateCollectionItemFormSchemaDef;
        await onUpdateCollectionItemById(data);
      } else {
        const data = value as CreateCollectionItemFormSchemaDef;
        await onCreateCollectionItem(data);
      }

      form.reset();
      resetEditingRowIds();
    },
    validationLogic: revalidateLogic({
      mode: 'submit',
      modeAfterSubmission: 'change',
    }),
    validators: {
      onChange: addOrUpdateCollectionItemFormSchema,
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
    resetWithLastAddedValues({
      customField1Value: lastAddedItem.customField1Value,
      customField2Value: lastAddedItem.customField2Value,
      customField3Value: lastAddedItem.customField3Value,
    });
  }, [lastAddedItem]);

  useEffect(() => {
    if (!isEditing) {
      form.reset();
    }
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
              addToEditingRowIds(uuidv4());
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
                        // restoreFormValuesFromSnapshot();
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
          sort={sortProps}
        />
      </form>
    </PageWrapper>
  );
};
