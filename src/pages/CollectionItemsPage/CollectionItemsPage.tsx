import type { RouteComponent } from '@tanstack/react-router';

import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useMemo } from 'react';

import { useCreateCollectionItem } from '#/api/routes/collection-items/create-collection-item/create-collection-item.react-query';
import { useDeleteCollectionItemsByIds } from '#/api/routes/collection-items/delete-collection-items-by-ids/delete-collection-items-by-ids.react-query';
import {
  useGetCollectionDetailsById,
  useInvalidateGetCollectionDetailsById,
} from '#/api/routes/collection-items/get-collection-details-by-id/get-collection-details-by-id.react-query';
import { useUpdateCollectionItemById } from '#/api/routes/collection-items/update-collection-item-by-id/update-collection-item-by-id.react-query';
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
import { useCollectionItemsFilters } from './hooks/use-collection-items-filters';
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

  const { collection, pagination } = data;

  const invalidateGetCollectionDetailsById =
    useInvalidateGetCollectionDetailsById();

  const onFormSubmitSuccess = async () => {
    await invalidateGetCollectionDetailsById({ id: collection.id });

    resetEditingRowIds();
  };

  const { onCreateCollectionItem } = useCreateCollectionItem({
    onSuccess: onFormSubmitSuccess,
  });

  const { onUpdateCollectionItemById } = useUpdateCollectionItemById({
    onSuccess: onFormSubmitSuccess,
  });

  const { resetEditingRowIds } = useEditingCollectionItemsRowIds();

  const form = useAddCollectionItemForm({
    defaultValues: addCollectionItemFormDefaultValues,
    onSubmit: async ({ value: { collectionItems } }) => {
      // TODO - UPDATE REQUESTS TO SUPPORT ADDING/UPDATING MULTIPLE RECORDS
      const [record] = collectionItems;
      if (record.createdAt) {
        await onUpdateCollectionItemById(record);
      } else {
        const {
          createdAt: _createdAt,
          id,
          updatedAt: _updatedAt,
          userId: _userId,
          ...newCollectionItemData
        } = record;
        await onCreateCollectionItem({
          ...newCollectionItemData,
          id: String(id),
        });
      }
    },
    validators: {
      onChange: createOrUpdateCollectionItemFormSchema,
      // onDynamic: createOrUpdateCollectionItemFormSchema,
      // onMount: createOrUpdateCollectionItemFormSchema,
      onSubmit: createOrUpdateCollectionItemFormSchema,
    },
  });

  useSetCollectionItemsFiltersFromQueries();

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
    const { id } = CollectionRoute.useParams();
    const collectionId = Number(id);
    const search = CollectionRoute.useSearch();

    const { data } = useGetCollectionDetailsById({
      onSuccess: ({ items }) => {
        form.setFieldValue('collectionItems', items);
      },
      requestArgs: { collectionId, params: search },
    });

    const { collection, customFields, pagination } = data;

    const onCancel = () => {
      resetEditingRowIds();

      form.setFieldValue('collectionItems', data.items);
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

    const filtersProps = useCollectionItemsFilters();
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
                AboveTableComponent={() => {
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
                              }}
                              text="Edit Items"
                              variant="secondary"
                            />

                            <Button
                              disabled={isEditing}
                              Icon={DeleteIcon}
                              onClick={() => {
                                onDeleteCollectionItemsByIds({
                                  collectionItemIds: selectedRowIds.map(
                                    (id) => {
                                      return Number(id);
                                    },
                                  ),
                                });
                              }}
                              processing={isDeletePending}
                              text="Delete Items"
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
        }}
      </form.AppField>
    );
  },
});
