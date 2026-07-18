import type { RouteComponent } from '@tanstack/react-router';

import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useMemo, useState } from 'react';

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
import { Table, useSelectedTableRowsStore } from '#/components/Table';
import { PageWrapper } from '#/page-wrapper';
import { Route as CollectionRoute } from '#/routes/_protected/collections/$id';

import { useEditingCollectionItemsRowIds } from '../CollectionsListPage/hooks/use-editing-collections-row-ids';
import { getCollectionItemsTableColumns } from './CollectionItemsPage.columns';
import { CollectionItemsFiltersContent } from './components/CollectionItemsFiltersContent';
import {
  AddNewCollectionItemButton,
  CreateOrUpdateCollectionItemSubmitButton,
} from './components/CreateOrUpdateCollectionItemForm';
import {
  addCollectionItemFormDefaultValues,
  useAddCollectionItemForm,
  withAddCollectionItemForm,
} from './components/CreateOrUpdateCollectionItemForm/CreateOrUpdateCollectionItemForm.form';
import { createOrUpdateCollectionItemFormSchema } from './components/CreateOrUpdateCollectionItemForm/CreateOrUpdateCollectionItemForm.schema';
import { useCollectionItemsFiltersProps } from './hooks/use-collection-items-filters-props';
import { useCollectionItemsPagination } from './hooks/use-collection-items-pagination';
import { useCollectionItemsSearch } from './hooks/use-collection-items-search';
import { useCollectionItemsSort } from './hooks/use-collection-items-sort';
import { useCustomFieldsStore } from './hooks/use-custom-fields-store';
import { useSetCollectionItemsFiltersFromQueries } from './hooks/use-set-collection-items-filters-from-queries';

export const CollectionItemsPage: RouteComponent = () => {
  const { id } = CollectionRoute.useParams();
  const searchParams = CollectionRoute.useSearch();
  const collectionId = Number(id);

  const [pageTitle, setPageTitle] = useState('-');

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

  const form = useAddCollectionItemForm({
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

  useSetCollectionItemsFiltersFromQueries();

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
        <CreateOrUpdateCollectionItemFormTable
          form={form}
          setPageTitle={setPageTitle}
        />
      </form>
    </PageWrapper>
  );
};

export const CreateOrUpdateCollectionItemFormTable = withAddCollectionItemForm({
  /** These values are only used for type-checking, and are not used at runtime */
  defaultValues: addCollectionItemFormDefaultValues,
  props: {
    setPageTitle: (_pageTitle: string) => {},
  },
  render: ({ form, setPageTitle }) => {
    const { id } = CollectionRoute.useParams();
    const collectionId = Number(id);
    const search = CollectionRoute.useSearch();

    const { customFields, setCustomFields } = useCustomFieldsStore();

    const { data } = useGetCollectionDetailsById({
      onSuccess: ({ customFields, items }) => {
        form.setFieldValue('collectionItems', items);
        resetEditingRowIds();
        resetSelectedTableRows();
        setPageTitle(`${collection.name} (${pagination.totalRecords})`);
        setCustomFields(customFields);
      },
      requestArgs: { collectionId, params: search },
    });

    const { collection, pagination } = data;

    const onCancel = () => {
      resetEditingRowIds();

      form.setFieldValue('collectionItems', data.items);
    };
    const { addToEditingRowIds, editingRowIds, isEditing, resetEditingRowIds } =
      useEditingCollectionItemsRowIds();

    const { getSelectedRowIds, resetSelectedTableRows, selectedTableRows } =
      useSelectedTableRowsStore();

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
    ]);

    const filtersProps = useCollectionItemsFiltersProps();
    const searchProps = useCollectionItemsSearch();
    const paginationProps = useCollectionItemsPagination({ pagination });
    const sortProps = useCollectionItemsSort({ collection });

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
            <div className="grid gap-4">
              <Table
                AboveTableComponent={(table) => {
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
                                  collectionItemsField.state.value.map(
                                    (rowRecord) => {
                                      const isEditing = selectedRowIds.includes(
                                        String(rowRecord.id),
                                      );

                                      return { ...rowRecord, isEditing };
                                    },
                                  );

                                collectionItemsField.setValue(
                                  selectedRowsInEditMode,
                                );
                              }}
                              text="Edit"
                              variant="secondary"
                            />

                            <Button
                              disabled={isEditing}
                              Icon={DeleteIcon}
                              onClick={async () => {
                                await onDeleteCollectionItemsByIds({
                                  collectionItemIds: selectedRowIds.map(
                                    (id) => {
                                      return Number(id);
                                    },
                                  ),
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
                            <CreateOrUpdateCollectionItemSubmitButton
                              form={form}
                            />
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
                columns={columns}
                // @ts-expect-error // TODO - INVESTIGATE TS SOLUTION
                data={collectionItemsField.state.value}
                filters={{
                  FiltersContent: () => {
                    return (
                      <CollectionItemsFiltersContent
                        collection={collection}
                        customFields={data.customFields}
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
        }}
      </form.AppField>
    );
  },
});
