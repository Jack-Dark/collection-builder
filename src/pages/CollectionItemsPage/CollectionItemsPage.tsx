import type { RouteComponent } from '@tanstack/react-router';

import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useEffect, useMemo, useState } from 'react';

import { useCreateCollectionItem } from '#/api/routes/collection-items/create-collection-item/create-collection-item.react-query';
import {
  useGetCollectionDetailsById,
  useInvalidateGetCollectionDetailsById,
} from '#/api/routes/collection-items/get-collection-details-by-id/get-collection-details-by-id.react-query';
import { useUpdateCollectionItemById } from '#/api/routes/collection-items/update-collection-item-by-id/update-collection-item-by-id.react-query';
import { Button } from '#/components/Button';
import { Table, useSelectedTableRowsStore } from '#/components/Table';
import { PageWrapper } from '#/page-wrapper';
import { Route as CollectionRoute } from '#/routes/_protected/collections/$id';

import type { CreateOrUpdateCollectionItemFormDataDef } from './components/CreateOrUpdateCollectionItemForm/CreateOrUpdateCollectionItemForm.types';

import { useEditingCollectionItemsRowIds } from '../CollectionsListPage/hooks/use-editing-collections-row-ids';
import { getCollectionItemsTableColumns } from './CollectionItemsPage.columns';
import { CollectionItemsFiltersContent } from './components/CollectionItemsFiltersContent';
import {
  addCollectionItemFormDefaultValues,
  tempNewCollectionItemId,
  useAddCollectionItemForm,
  withAddCollectionItemForm,
} from './components/CreateOrUpdateCollectionItemForm/CreateOrUpdateCollectionItemForm.form';
import { createOrUpdateCollectionItemFormSchema } from './components/CreateOrUpdateCollectionItemForm/CreateOrUpdateCollectionItemForm.schema';
import { useCollectionItemsFilters } from './hooks/use-collection-items-filters';
import { useCollectionItemsFormStore } from './hooks/use-collection-items-form-store';
import { useCollectionItemsPagination } from './hooks/use-collection-items-pagination';
import { useCollectionItemsSearch } from './hooks/use-collection-items-search';
import { useCollectionItemsSort } from './hooks/use-collection-items-sort';
import { useSetCollectionItemsFiltersFromQueries } from './hooks/use-set-collection-items-filters-from-queries';

export const CollectionItemsPage: RouteComponent = () => {
  const { id } = CollectionRoute.useParams();
  const collectionId = Number(id);
  const search = CollectionRoute.useSearch();

  const { data } = useGetCollectionDetailsById({
    requestArgs: { collectionId, params: search },
  });

  const { collection, lastAddedItem, pagination } = data;

  const { formValues, resetFormValues, updateDefaultValues } =
    useCollectionItemsFormStore();

  const invalidateGetCollectionDetailsById =
    useInvalidateGetCollectionDetailsById();

  const onFormSubmitSuccess = async () => {
    await invalidateGetCollectionDetailsById({ id: collection.id });

    resetEditingRowIds();
    form.reset();
  };

  const { onCreateCollectionItem } = useCreateCollectionItem({
    onSuccess: onFormSubmitSuccess,
  });

  const { onUpdateCollectionItemById } = useUpdateCollectionItemById({
    onSuccess: onFormSubmitSuccess,
  });

  const { isEditing, resetEditingRowIds } = useEditingCollectionItemsRowIds();

  const form = useAddCollectionItemForm({
    defaultValues: formValues,
    onSubmit: async ({ value }) => {
      if (value.createdAt) {
        await onUpdateCollectionItemById(value);
      } else {
        const {
          createdAt: _createdAt,
          id,
          updatedAt: _updatedAt,
          userId: _userId,
          ...newCollectionItemData
        } = value;
        await onCreateCollectionItem({
          ...newCollectionItemData,
          id: String(id),
        });
      }
    },
    validators: {
      onChange: createOrUpdateCollectionItemFormSchema,
      onDynamic: createOrUpdateCollectionItemFormSchema,
      onMount: createOrUpdateCollectionItemFormSchema,
      onSubmit: createOrUpdateCollectionItemFormSchema,
    },
  });

  useSetCollectionItemsFiltersFromQueries();

  useEffect(() => {
    const newFormValues = {
      collectionId,
      customField1Value: lastAddedItem?.customField1Value || '',
      customField2Value: lastAddedItem?.customField2Value || '',
      customField3Value: lastAddedItem?.customField3Value || '',
    };
    updateDefaultValues(newFormValues);
    resetFormValues();
  }, [lastAddedItem]);

  useEffect(() => {
    form.reset();
  }, [isEditing]);

  return (
    <PageWrapper
      title={
        collection?.name
          ? `${collection.name} (${pagination.totalRecords})`
          : '-'
      }
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <CreateOrUpdateCollectionItemFormTable form={form} />
      </form>
    </PageWrapper>
  );
};

export const CreateOrUpdateCollectionItemFormTable = withAddCollectionItemForm({
  /** These values are only used for type-checking, and are not used at runtime */
  defaultValues: addCollectionItemFormDefaultValues,
  render: ({ form }) => {
    const [tableData, setTableData] = useState<
      CreateOrUpdateCollectionItemFormDataDef[]
    >([]);

    const { id } = CollectionRoute.useParams();
    const collectionId = Number(id);
    const search = CollectionRoute.useSearch();

    const { data } = useGetCollectionDetailsById({
      onSuccess: ({ items }) => {
        setTableData(items);
      },
      requestArgs: { collectionId, params: search },
    });

    const { collection, customFields, pagination } = data;

    const onCancel = () => {
      resetEditingRowIds();
      setTableData((prevValues) => {
        return prevValues.filter(({ createdAt }) => {
          return createdAt;
        });
      });

      resetFormValues();
      form.reset();
    };
    const { addToEditingRowIds, editingRowIds, isEditing, resetEditingRowIds } =
      useEditingCollectionItemsRowIds();

    const { getSelectedRowIds, selectedTableRows } =
      useSelectedTableRowsStore();

    const columns = useMemo(() => {
      return getCollectionItemsTableColumns({
        customField1Enabled: collection.customField1Enabled,
        customField1Label: collection.customField1Label,
        customField2Enabled: collection.customField2Enabled,
        customField2Label: collection.customField2Label,
        customField3Enabled: collection.customField3Enabled,
        customField3Label: collection.customField3Label,
        customFields,
        form,
        onCancel,
      });
    }, [
      collection.customField1Enabled,
      collection.customField1Label,
      collection.customField2Enabled,
      collection.customField2Label,
      collection.customField3Enabled,
      collection.customField3Label,
      editingRowIds,
    ]);

    const { resetFormValues } = useCollectionItemsFormStore();

    const filtersProps = useCollectionItemsFilters();
    const searchProps = useCollectionItemsSearch();
    const paginationProps = useCollectionItemsPagination({ pagination });
    const sortProps = useCollectionItemsSort({ collection });

    const selectedRowIds = useMemo(() => {
      return getSelectedRowIds();
    }, [selectedTableRows]);

    return (
      <div className="grid gap-4">
        <div className="flex justify-between">
          <div className="flex gap-2">
            {!!selectedRowIds.length && (
              <>
                <Button
                  disabled={isEditing}
                  Icon={EditIcon}
                  onClick={() => {
                    addToEditingRowIds(...selectedRowIds);
                    // TODO - ADD SELECTED ITEMS TO FORM DATA
                  }}
                  text="Edit Items"
                  variant="secondary"
                />

                <Button
                  disabled={isEditing}
                  Icon={DeleteIcon}
                  onClick={() => {
                    // TODO - ADD DELETE LOGIC
                  }}
                  text="Delete Items"
                  variant="alert"
                />
              </>
            )}
          </div>

          {isEditing ? (
            <Button
              Icon={ClearIcon}
              onClick={onCancel}
              text="Cancel"
              variant="mono"
            />
          ) : (
            <Button
              Icon={AddIcon}
              onClick={() => {
                addToEditingRowIds(tempNewCollectionItemId);
                setTableData((prevData) => {
                  return [addCollectionItemFormDefaultValues, ...prevData];
                });
              }}
              text="Add New"
              variant="secondary"
            />
          )}
        </div>

        <Table
          columns={columns}
          // @ts-expect-error // TODO - INVESTIGATE TS SOLUTION
          data={tableData}
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
          pagination={paginationProps}
          search={searchProps}
          sort={sortProps}
        />
      </div>
    );
  },
});
