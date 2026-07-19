import type { RouteComponent } from '@tanstack/react-router';

import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useRouterState } from '@tanstack/react-router';
import { useEffect, useMemo } from 'react';

import type { OnCreateCollectionItemsArgsDef } from '#/api/routes/collection-items/create-collection-item/create-collection-item.types';
import type { OnUpdateCollectionItemsArgsDef } from '#/api/routes/collection-items/update-collection-item-by-id/update-collection-item-by-id.types';

import { useCreateCollectionItems } from '#/api/routes/collection-items/create-collection-item/create-collection-item.react-query';
import { useDeleteCollectionItemsByIds } from '#/api/routes/collection-items/delete-collection-items-by-ids/delete-collection-items-by-ids.react-query';
import {
  useGetCollectionDetailsById,
  useInvalidateGetCollectionDetailsById,
} from '#/api/routes/collection-items/get-collection-details-by-id/get-collection-details-by-id.react-query';
import { useUpdateCollectionItems } from '#/api/routes/collection-items/update-collection-item-by-id/update-collection-item-by-id.react-query';
import { Button } from '#/components/Button';
import { useSpinner } from '#/components/FullPageLoadingSpinner/useSpinner';
import { Table, useSelectedTableRowsStore } from '#/components/Table';
import { PageWrapper } from '#/page-wrapper';
import { Route as CollectionRoute } from '#/routes/_protected/collections/$id';

import { useEditingCollectionItemsRowIds } from '../CollectionsListPage/hooks/use-editing-collections-row-ids';
import { getCollectionItemsTableColumns } from './components/CollectionDetailsTable/CollectionDetailsTable.columns';
import { CollectionItemsFiltersContent } from './components/CollectionDetailsTable/components/CollectionItemsFiltersContent';
import {
  AddNewCollectionItemButton,
  CreateOrUpdateCollectionItemSubmitButton,
} from './components/CreateOrUpdateCollectionItemForm';
import {
  addCollectionItemFormDefaultValues,
  useCollectionDetailsForm,
  withCollectionDetailsForm,
} from './components/CreateOrUpdateCollectionItemForm/CreateOrUpdateCollectionItemForm.form';
import { createOrUpdateCollectionItemFormSchema } from './components/CreateOrUpdateCollectionItemForm/CreateOrUpdateCollectionItemForm.schema';
import { useCollectionItemsFiltersProps } from './hooks/use-collection-items-filters-props';
import { useCollectionItemsPagination } from './hooks/use-collection-items-pagination';
import { useCollectionItemsSearch } from './hooks/use-collection-items-search';
import { useCollectionItemsSort } from './hooks/use-collection-items-sort';
import { useSetCollectionItemsFiltersFromQueries } from './hooks/use-set-collection-items-filters-from-queries';
import { useTableCustomFieldsStore } from './hooks/use-table-custom-fields-store';

export const CollectionDetailsPage: RouteComponent = () => {
  const { id } = CollectionRoute.useParams();
  const searchParams = CollectionRoute.useSearch();
  const collectionId = Number(id);

  const { isLoading } = useRouterState();
  const { toggleSpinner } = useSpinner();

  useSetCollectionItemsFiltersFromQueries();

  const invalidateGetCollectionDetailsById =
    useInvalidateGetCollectionDetailsById();

  const onFormSubmitSuccess = async () => {
    await invalidateGetCollectionDetailsById({ id: collectionId });
  };

  const { onCreateCollectionItem } = useCreateCollectionItems({
    onSuccess: onFormSubmitSuccess,
  });

  const { onUpdateCollectionItems: onUpdateCollectionItemById } =
    useUpdateCollectionItems({
      onSuccess: onFormSubmitSuccess,
    });

  const { data } = useGetCollectionDetailsById({
    requestArgs: { collectionId, params: searchParams },
  });

  const form = useCollectionDetailsForm({
    defaultValues: data?.items
      ? {
          collectionItems: data.items.map((item) => {
            return { ...item, isEditing: false };
          }),
        }
      : addCollectionItemFormDefaultValues,
    onSubmit: async ({ value: { collectionItems } }) => {
      const editedRecords = collectionItems.filter(({ isEditing }) => {
        return isEditing;
      });

      const isUpdatedRecords = editedRecords.some(({ createdAt }) => {
        return createdAt;
      });

      if (isUpdatedRecords) {
        await onUpdateCollectionItemById(
          editedRecords as OnUpdateCollectionItemsArgsDef[],
        );
      } else {
        const newRecords = editedRecords.map((record) => {
          const {
            createdAt: _createdAt,
            id,
            isEditing: _isEditing,
            updatedAt: _updatedAt,
            userId: _userId,
            ...newCollectionItemData
          } = record;

          return { ...newCollectionItemData, id: String(id) };
        });
        await onCreateCollectionItem(
          newRecords as OnCreateCollectionItemsArgsDef[],
        );
      }
    },
    validators: {
      onChange: createOrUpdateCollectionItemFormSchema,
      onSubmit: createOrUpdateCollectionItemFormSchema,
    },
  });

  useEffect(() => {
    toggleSpinner(isLoading);
  }, [isLoading]);

  return (
    <PageWrapper
      title={`${data?.collection.name} (${data?.pagination.totalRecords})`}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <CollectionDetailsTable form={form} />
      </form>
    </PageWrapper>
  );
};

export const CollectionDetailsTable = withCollectionDetailsForm({
  /** These values are only used for type-checking, and are not used at runtime */
  defaultValues: addCollectionItemFormDefaultValues,
  render: ({ form }) => {
    const { id } = CollectionRoute.useParams();
    const collectionId = Number(id);
    const search = CollectionRoute.useSearch();

    const { customFields, setCustomFields } = useTableCustomFieldsStore();

    const { data } = useGetCollectionDetailsById({
      onSuccess: ({ customFields, items }) => {
        form.setFieldValue('collectionItems', items);
        resetEditingRowIds();
        resetSelectedTableRows();
        setCustomFields(customFields);
      },
      requestArgs: { collectionId, params: search },
    });

    const { collection, pagination } = data;

    const onCancel = () => {
      resetEditingRowIds();

      form.setFieldValue('collectionItems', data.items);
    };
    const { addToEditingRowIds, editingRowIds, resetEditingRowIds } =
      useEditingCollectionItemsRowIds();

    const { getSelectedRowIds, resetSelectedTableRows, selectedTableRows } =
      useSelectedTableRowsStore();

    const selectedRowIds = useMemo(() => {
      return getSelectedRowIds();
    }, [selectedTableRows]);

    const onEditClick = (rowId?: string) => {
      const rowsToAdd = rowId ? [rowId] : selectedRowIds;
      addToEditingRowIds(...rowsToAdd);

      const selectedRowsInEditMode = form.state.values.collectionItems.map(
        (rowRecord) => {
          const isEditing = rowsToAdd.includes(String(rowRecord.id));

          return { ...rowRecord, isEditing };
        },
      );

      form.setFieldValue('collectionItems', selectedRowsInEditMode);
    };

    const columns = useMemo(() => {
      return getCollectionItemsTableColumns({
        customField1Enabled: collection.customField1Enabled,
        customField1Label: collection.customField1Label,
        customField2Enabled: collection.customField2Enabled,
        customField2Label: collection.customField2Label,
        customField3Enabled: collection.customField3Enabled,
        customField3Label: collection.customField3Label,
        form,
        onCancel,
        onEditClick,
      });
    }, [
      collection.customField1Enabled,
      collection.customField1Label,
      collection.customField2Enabled,
      collection.customField2Label,
      collection.customField3Enabled,
      collection.customField3Label,
      editingRowIds,
      customFields,
      selectedRowIds,
    ]);

    const filtersProps = useCollectionItemsFiltersProps();
    const searchProps = useCollectionItemsSearch();
    const paginationProps = useCollectionItemsPagination({ pagination });
    const sortProps = useCollectionItemsSort({ collection });

    return (
      <form.AppField mode="array" name="collectionItems">
        {(collectionItemsField) => {
          return (
            <Table
              AboveTableComponent={() => {
                return (
                  <CollectionDetailsTableActions
                    form={form}
                    onCancel={onCancel}
                  />
                );
              }}
              columns={columns}
              // @ts-expect-error // TS type mismatch between new and old records
              data={collectionItemsField.state.value}
              filters={{
                ...filtersProps,
                FiltersContent: () => {
                  return (
                    <CollectionItemsFiltersContent
                      collection={collection}
                      customFields={data.customFields}
                    />
                  );
                },
              }}
              pagination={paginationProps}
              search={searchProps}
              sort={sortProps}
            />
          );
        }}
      </form.AppField>
    );
  },
});

export const CollectionDetailsTableActions = withCollectionDetailsForm({
  /** These values are only used for type-checking, and are not used at runtime */
  defaultValues: addCollectionItemFormDefaultValues,
  props: {
    onCancel: () => {},
  },
  render: ({ form, onCancel }) => {
    const { id } = CollectionRoute.useParams();
    const collectionId = Number(id);

    const { addToEditingRowIds, isEditing } = useEditingCollectionItemsRowIds();

    const { getSelectedRowIds, selectedTableRows } =
      useSelectedTableRowsStore();

    const selectedRowIds = useMemo(() => {
      return getSelectedRowIds();
    }, [selectedTableRows]);

    const invalidateGetCollectionDetailsById =
      useInvalidateGetCollectionDetailsById();

    const { isPending: isDeletePending, onDeleteCollectionItemsByIds } =
      useDeleteCollectionItemsByIds({
        onSuccess: async () => {
          await invalidateGetCollectionDetailsById({
            id: collectionId,
          });
        },
      });

    return (
      <form.AppField mode="array" name="collectionItems">
        {(collectionItemsField) => {
          return (
            <div className="flex justify-between">
              <div className="flex gap-2">
                {!!selectedRowIds.length && (
                  <>
                    <Button
                      disabled={isEditing}
                      Icon={EditIcon}
                      onClick={() => {
                        addToEditingRowIds(...selectedRowIds);

                        const selectedRowsInEditMode =
                          collectionItemsField.state.value.map((rowRecord) => {
                            const isEditing = selectedRowIds.includes(
                              String(rowRecord.id),
                            );

                            return { ...rowRecord, isEditing };
                          });

                        collectionItemsField.setValue(selectedRowsInEditMode);
                      }}
                      text="Edit"
                      variant="secondary"
                    />

                    <Button
                      disabled={isEditing}
                      Icon={DeleteIcon}
                      onClick={async () => {
                        await onDeleteCollectionItemsByIds({
                          collectionItemIds: selectedRowIds.map((id) => {
                            return Number(id);
                          }),
                        });
                      }}
                      processing={isDeletePending}
                      text="Delete"
                      variant="alert"
                    />
                  </>
                )}
              </div>

              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button
                      Icon={ClearIcon}
                      onClick={onCancel}
                      text="Cancel"
                      variant="mono"
                    />
                    <CreateOrUpdateCollectionItemSubmitButton form={form} />
                  </>
                ) : (
                  <AddNewCollectionItemButton
                    disabled={false}
                    form={form}
                    insertAtIndex={0}
                    text="Add New"
                  />
                )}
              </div>
            </div>
          );
        }}
      </form.AppField>
    );
  },
});
